import { Head } from "@inertiajs/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AppLayout from "@/layouts/app-layout";

export default function Page() {
  return (
    <AppLayout>
      <Head title="Kapcsolat"></Head>
      <main className="container space-y-8 px-4 pt-8 pb-20">
        <h1 className="text-5xl">Kapcsolat</h1>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Telefon - Mester Gábor elnök</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <a className="text-primary hover:underline" href="tel:+36 20 311 1919">
                  +36 20 311 1919
                </a>
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Telefon - Szücsi Ildikó alelnök</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <a className="text-primary hover:underline" href="tel:+36 20 983 1741">
                  +36 20 983 1741
                </a>
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Email</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>
                <a className="text-primary hover:underline" href="mailto:akrobatikustorna@gmail.com">
                  akrobatikustorna@gmail.com
                </a>
              </p>
              <p>
                <a className="text-primary hover:underline" href="mailto:info@akrobatikustorna.hu">
                  info@akrobatikustorna.hu
                </a>
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Levelezési cím</CardTitle>
            </CardHeader>
            <CardContent>
              <p>1038 Budapest Határ út 15.</p>
            </CardContent>
          </Card>
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Torna Csarnok</CardTitle>
              <CardDescription>BMSZC Bláthy Ottó Titusz Informatikai Technikum</CardDescription>
            </CardHeader>
            <CardContent>
              <noscript>
                <p>
                  <a
                    className="text-primary hover:underline"
                    href="https://goo.gl/maps/BxvvHhFyhV3GWPcS9"
                    target="_blank"
                    rel="noreferrer"
                  >
                    1032 Budapest, Bécsi út 134
                  </a>
                </p>
              </noscript>
              <p>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d5386.781142626678!2d19.0254142!3d47.5407267!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4741d965189cf915%3A0xd7c9db1c8efb4d8e!2sBudai%20Akrobatikus%20Sport%20Egyes%C3%BClet!5e0!3m2!1sen!2shu!4v1748309587347!5m2!1sen!2shu"
                  width="600"
                  height="450"
                  className="w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Budai Akrobatikus Sport Egyesület - Torna Csarnok"
                  allowFullScreen
                />
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </AppLayout>
  );
}
