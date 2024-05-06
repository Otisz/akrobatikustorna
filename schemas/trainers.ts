import { orderRankField, orderRankOrdering } from "@sanity/orderable-document-list";

/** @type {import('sanity').Schema} */
export default {
  name: "trainers",
  type: "document",
  title: "Edzők",
  fields: [
    {
      name: "name",
      title: "Név",
      type: "string",
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Ez jelenik meg a böngésző címsorában.",
      options: {
        source: "name",
        maxLength: 96,
      },
    },
    {
      name: "role",
      title: "Munkakör",
      type: "string",
    },
    {
      name: "mainImage",
      title: "Kép",
      type: "image",
    },
    {
      name: "color",
      title: "Háttérszín",
      type: "color",
      options: {
        disableAlpha: true,
      },
    },
    {
      name: "body",
      title: "Szöveg",
      type: "array",
      of: [{ type: "block" }],
    },
    orderRankField({ type: "trainers" }),
  ],
  orderings: [orderRankOrdering],
};
