/** @type {import('sanity').Schema} */
export default {
  name: "news",
  type: "document",
  title: "Hírek",
  fields: [
    {
      name: "title",
      title: "Cím",
      type: "string",
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Ez jelenik meg a böngésző címsorában.",
      options: {
        source: "title",
        maxLength: 96,
      },
    },
    {
      name: "mainImage",
      title: "Kép",
      type: "image",
    },
    {
      name: "summary",
      title: "Rövid leírás",
      type: "string",
    },
    {
      name: "body",
      title: "Szöveg",
      type: "array",
      of: [{ type: "block" }, { type: "image" }],
    },
  ],
};
