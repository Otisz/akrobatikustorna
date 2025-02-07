import * as React from "react";

type Props = {
  children: React.ReactNode;
};

export default function PostsWrapper(props: Props) {
  return <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">{props.children}</div>;
}
