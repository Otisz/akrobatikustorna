import { parseBody } from "next-sanity/webhook";
import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { body, isValidSignature } = await parseBody<{
      _type: string;
      slug?: string | undefined;
    }>(req, process.env.NEXT_PUBLIC_SANITY_HOOK_SECRET);

    if (!isValidSignature) {
      return new Response("Invalid Signature", { status: 401 });
    }

    if (!body?._type) {
      return new Response("Bad Request", { status: 400 });
    }

    if (body._type === "news") {
      revalidatePath("/", "page");
      revalidatePath("/hirek", "page");

      if (body.slug) {
        revalidatePath(`/hirek/${body.slug}`, "page");
      }
    }

    if (body._type === "trainers") {
      revalidatePath("/edzok", "page");

      if (body.slug) {
        revalidatePath(`/edzok/${body.slug}`, "page");
      }
    }

    return NextResponse.json({
      status: 200,
      revalidated: true,
      now: Date.now(),
      body,
    });
  } catch (error: any) {
    console.error(error);
    return new Response(error.message, { status: 500 });
  }
}
