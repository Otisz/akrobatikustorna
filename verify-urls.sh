#!/usr/bin/env bash
#
# Asks a deployed site for every address the outgoing site published, the way a
# search engine asks: signed out, without a trailing slash, and following
# redirects. Prints one line per address and fails if any of them lands anywhere
# other than the page it names.
#
# The cutover is the moment these can break silently and irreversibly — nothing
# on any screen says when an address stopped resolving, and a lost address takes
# the club's search ranking with it — so this is run immediately after the domain
# moves. Run it from a checkout of this branch — anywhere with curl and these
# files, which on the server means the site's own directory:
#
#   bash verify-urls.sh https://akrobatikustorna.hu
#
# The list is read from `tests/support/preserved-urls.ts` rather than repeated
# here, so that there is one place an address can be added. `url-parity.spec.ts`
# asks for the same list locally, on every test run; this is the same check
# against a site nothing else can reach.
#
# The two addresses that take a slug, /hirek/{slug} and /edzok/{slug}, are not in
# the list — there is no address until something is published at one — so a Post
# and a Trainer are looked up here from the listings instead.

set -euo pipefail

cd "$(dirname "$0")"

site="${1:-}"

if [ -z "$site" ]; then
  echo "usage: bash verify-urls.sh <site address>" >&2
  echo "       e.g. bash verify-urls.sh https://akrobatikustorna.hu" >&2
  exit 1
fi

site="${site%/}"
urls_file="tests/support/preserved-urls.ts"

if [ ! -f "$urls_file" ]; then
  echo "ERROR: $urls_file is missing, so there is no list of addresses to check." >&2
  echo "       Run this from a checkout of the wordpress branch." >&2
  exit 1
fi

# Staging answers every request behind one shared password, so checking it needs
# those credentials; production takes none and this stays empty. Spelled with the
# `+` guard, because an empty array is an unbound variable under `set -u` in the
# bash a Mac ships.
auth=()

if [ -n "${STAGING_USER:-}" ]; then
  auth=(--user "${STAGING_USER}:${STAGING_PASSWORD:-}")
fi

curl_auth() {
  curl "$@" ${auth[@]+"${auth[@]}"}
}

failed=0

# Where curl's complaints are kept between the call and the line printed about
# it, removed however the script ends.
errors="$(mktemp)"
trap 'rm -f "$errors"' EXIT

# The address as published, and the page it must land on: a redirect to the home
# page or to a search results screen is a 200 that has still lost the page.
check() {
  local path="$1"
  local probe status landed reason

  # Written as one field pair rather than read line by line, because curl's `-w`
  # prints no trailing newline and `read` returning on its absence would end the
  # script under `set -e`. curl's own complaint is kept rather than discarded: a
  # name that does not resolve and a certificate that is not trusted would both
  # otherwise print as a bare `000`.
  reason=""
  probe="$(
    curl_auth -sSL -o /dev/null \
      -w '%{http_code} %{url_effective}' "$site$path" 2>"$errors"
  )" || reason="$(tr -d '\n' <"$errors")"
  probe="${probe:-000 -}"
  status="${probe%% *}"
  landed="${probe#* }"

  local wanted="${path%/}"
  local reached
  reached="$(printf '%s' "$landed" | sed -e 's|^[a-z]*://[^/]*||' -e 's|/$||')"

  if [ "$status" = "200" ] && [ "$reached" = "$wanted" ]; then
    printf '  ok      %s\n' "$path"
  else
    printf '  FAILED  %s — %s %s%s\n' "$path" "$status" "$landed" "${reason:+ — $reason}"
    failed=$((failed + 1))
  fi
}

# The first entry of a listing, as its own address: whichever Post and Trainer the
# club has published, so that the two addresses taking a slug are checked too
# without naming content this script cannot know about.
first_entry() {
  curl_auth -sSL "$site$1/" 2>/dev/null \
    | grep -o "href=\"[^\"]*$1/[^\"/]\+/\?\"" \
    | sed -e 's|^href="||' -e 's|"$||' -e 's|^[a-z]*://[^/]*||' \
    | grep -v '/\(feed\|page\)/\?$' \
    | head -n 1
}

echo "Asking $site for every address the outgoing site published:"

while read -r path; do
  check "$path"
done < <(sed -n "s/^.*{ path: '\([^']*\)'.*$/\1/p" "$urls_file")

for listing in /hirek /edzok; do
  # `|| true`, because the search is a pipeline whose `grep` exits non-zero when
  # the listing holds no entry — which is a finding to report below, not a reason
  # for the script to stop before it has reported anything.
  entry="$(first_entry "$listing" || true)"

  if [ -z "$entry" ]; then
    # Counted as a failure rather than passed over. By the cutover the club has
    # published both news and coaches, so finding neither means either that the
    # content did not come across — itself the thing this script is run to catch —
    # or that the listing's markup moved out from under the search below.
    printf '  FAILED  %s/{slug} — no entry found to ask for\n' "$listing"
    failed=$((failed + 1))
  else
    check "${entry%/}"
  fi
done

if [ "$failed" -gt 0 ]; then
  echo "ERROR: $failed address(es) went unverified, so the cutover is not done." >&2
  echo "       Each one above is an address the outgoing site published and a" >&2
  echo "       search engine still offers. Check the permalink structure and the" >&2
  echo "       rewrite slugs in web/app/mu-plugins/ before announcing the site." >&2
  exit 1
fi

echo "Every preserved address resolves."
