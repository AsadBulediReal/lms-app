"use client";

import dynamic from "next/dynamic";
import { forwardRef, useMemo } from "react";

import "react-quill/dist/quill.snow.css";

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

const Editor = forwardRef<HTMLDivElement, EditorProps>((props, ref) => {
  const ReactQuill = useMemo(() => {
    return dynamic(() => import("react-quill"), { ssr: false });
  }, []);

  return (
    <div ref={ref} className="bg-white">
      <ReactQuill theme="snow" value={props.value} onChange={props.onChange} />
    </div>
  );
});

export default Editor;
