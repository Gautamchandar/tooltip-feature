import { useRef, useState } from "react";
import { Check, Code2, Copy, X } from "lucide-react";
import Tooltip from "@/components/ToolTip/Tooltip";

function CodePanel({
  code,
  filename = "example.tsx",
}: {
  code: string;
  filename?: string;
}) {
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 1800);
    } catch (e) {
      console.error("Copy failed", e);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200 bg-slate-50">
        <span className="text-xs font-medium text-slate-500">{filename}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            disabled={!showCode}
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200/70 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {copied ? (
              <>
                <Check size={13} className="text-teal-600" />
                <span className="text-teal-600">Copied</span>
              </>
            ) : (
              <>
                <Copy size={13} />
                Copy code
              </>
            )}
          </button>
          <button
            onClick={() => setShowCode((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-2.5 py-1 text-xs font-medium text-white hover:bg-slate-700 transition-colors"
          >
            {showCode ? (
              <>
                <X size={13} />
                Hide code
              </>
            ) : (
              <>
                <Code2 size={13} />
                View code
              </>
            )}
          </button>
        </div>
      </div>

      {showCode && (
        <pre className="max-h-80 overflow-auto bg-slate-950 px-4 py-4 text-[13px] leading-relaxed text-slate-100">
          <code>{code}</code>
        </pre>
      )}
    </div>
  );
}

function Section({
  title,
  description,
  children,
  code,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  code: string;
}) {
  return (
    <section className="flex flex-col gap-3">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-8 flex flex-wrap items-center justify-center gap-8">
        {children}
      </div>
      <CodePanel code={code} filename="Tooltip.tsx usage" />
    </section>
  );
}

const btnClass =
  "rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:border-slate-300";

function ControlledDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex items-center gap-4">
      <Tooltip
        label="I'm controlled from outside"
        open={open}
        onOpenChange={setOpen}
      >
        <button className={btnClass}>Target</button>
      </Tooltip>
      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
      >
        {open ? "Close tooltip" : "Open tooltip"}
      </button>
    </div>
  );
}

const TooltipPage = () => {
  return (
    <div className="p-8 flex flex-col gap-12 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Tooltip</h1>
        <p className="text-sm text-slate-500 mt-1">
          Tooltips display informative text when users hover over, focus on, or
          tap an element.
        </p>
      </div>

      {/* 1. Basic */}
      <Section
        title="Basic tooltip"
        description="Hover over it or focus on it, and the tooltip will appear."
        code={`<Tooltip label="Saves your changes">
  <button>Basic</button>
</Tooltip>`}
      >
        <Tooltip label="Saves your changes">
          <button className={btnClass}>Basic</button>
        </Tooltip>
      </Section>

      {/* 2. Arrow */}
      <Section
        title="Arrow tooltip"
        description="The arrow prop adds a small pointer arrow along with the tooltip."
        code={`<Tooltip label="Add item" arrow>
  <button>Arrow</button>
</Tooltip>`}
      >
        <Tooltip label="Add item" arrow>
          <button className={btnClass}>Arrow</button>
        </Tooltip>
      </Section>

      {/* 3. Placements */}
      <Section
        title="Placements"
        description="The side prop is used to set the position to top, bottom, left, or right."
        code={`<Tooltip label="Top" side="top"><button>Top</button></Tooltip>
<Tooltip label="Bottom" side="bottom"><button>Bottom</button></Tooltip>
<Tooltip label="Left" side="left"><button>Left</button></Tooltip>
<Tooltip label="Right" side="right"><button>Right</button></Tooltip>`}
      >
        <Tooltip label="Top" side="top" arrow>
          <button className={btnClass}>Top</button>
        </Tooltip>
        <Tooltip label="Bottom" side="bottom" arrow>
          <button className={btnClass}>Bottom</button>
        </Tooltip>
        <Tooltip label="Left" side="left" arrow>
          <button className={btnClass}>Left</button>
        </Tooltip>
        <Tooltip label="Right" side="right" arrow>
          <button className={btnClass}>Right</button>
        </Tooltip>
      </Section>

      {/* 4. variants */}
      <Section
        title="Colors"
        description="Choose the dark (default) or light theme using the variant prop"
        code={`<Tooltip label="Dark tooltip" variant="dark">
  <button>Dark</button>
</Tooltip>
<Tooltip label="Light tooltip" variant="light" arrow>
  <button>Light</button>
</Tooltip>`}
      >
        <Tooltip label="Dark tooltip" variant="dark">
          <button className={btnClass}>Dark</button>
        </Tooltip>
        <Tooltip label="Light tooltip" variant="light" arrow>
          <button className={btnClass}>Light</button>
        </Tooltip>
      </Section>

      {/* 5. Click trigger */}
      <Section
        title="Click trigger"
        description="With trigger='click', the tooltip doesn’t appear on hover. Instead, it opens and closes when clicked, and it closes when you click outside."
        code={`<Tooltip label="Clicked open!" trigger="click">
  <button>Click me</button>
</Tooltip>`}
      >
        <Tooltip label="Clicked open!" trigger="click" arrow>
          <button className={btnClass}>Click me</button>
        </Tooltip>
      </Section>

      {/* 6. Controlled */}
      <Section
        title="Controlled tooltip"
        description="With the open and onOpenChange props, you can manage the tooltip's state yourself, even from an external button."
        code={`const [open, setOpen] = useState(false);

<Tooltip label="I'm controlled from outside" open={open} onOpenChange={setOpen}>
  <button>Target</button>
</Tooltip>
<button onClick={() => setOpen(v => !v)}>Toggle</button>`}
      >
        <ControlledDemo />
      </Section>

      {/* 7. Disabled element */}
      <Section
        title="Disabled element"
        description="Disabled buttons don’t fire events themselves, so the disabled prop allows the tooltip to work by wrapping the button in a <span>"
        code={`<Tooltip label="You don't have permission" disabled>
  <button disabled>Disabled</button>
</Tooltip>`}
      >
        <Tooltip label="You don't have permission" disabled>
          <button
            disabled
            className={`${btnClass} cursor-not-allowed opacity-60`}
          >
            Disabled
          </button>
        </Tooltip>
      </Section>
    </div>
  );
};

export default TooltipPage;
