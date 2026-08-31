import React from "react";
import { cn } from "@/lib/utils";

/**
 * The prop surface Field needs to be able to inject onto the control it
 * wraps. Any child element type is allowed, but its declared props must
 * include these keys (id/aria-*, optionally undefined).
 *
 * These are deliberately NOT written with `?:` (optional): an optional
 * property is satisfied by any type whether present or absent, so `P
 * extends FieldControlProps` with optional keys would accept a child whose
 * props never mention id or aria-* at all. Required keys typed `X |
 * undefined` still accept a child whose own props declare the key
 * optionally (native `id?: string` included), but reject one whose props
 * omit the key entirely -- verified with `test<{value: string}>({value: "z"})`
 * against `function test<P extends FieldControlProps>(p: P)`, which does
 * correctly fail to typecheck.
 *
 * IMPORTANT LIMITATION, confirmed empirically against this project's
 * TypeScript (5.9.3) and @types/react: this constraint only bites when P is
 * resolved from something other than a bare inline JSX expression. Every
 * JSX element TypeScript's checker produces -- `<input id="x" />`,
 * `<CustomBad value="z" />`, doesn't matter -- has the exact same static
 * type, the global `JSX.Element` (= `React.ReactElement<any, any>`), with
 * props typed `any`. That is true even of `React.cloneElement` called
 * directly on such a value with no generic wrapper involved at all. So
 * `<Field id="x" label="y"><CustomBad value="z" /></Field>` does NOT
 * produce a compile error today, no matter how FieldControlProps is
 * shaped: the generic constraint below correctly typechecks the real
 * intended cases and does not regress anything, but it cannot be the
 * enforcement mechanism for the failure mode this guards against. See the
 * runtime check in Field's body for the mechanism that actually catches a
 * child failing to forward these props (Field.childForwarding.test.tsx).
 */
export type FieldControlProps = {
  id: string | undefined;
  "aria-invalid": React.AriaAttributes["aria-invalid"] | undefined;
  "aria-describedby": string | undefined;
  "aria-required": React.AriaAttributes["aria-required"] | undefined;
};

export interface FieldProps<P extends FieldControlProps = FieldControlProps> {
  /** Id shared with the control. Used for the label association and to build the helper/error ids. */
  id: string;
  label: React.ReactNode;
  helper?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  className?: string;
  /** A single form control (input, textarea, select, ...). Cloned to receive id and ARIA wiring. */
  children: React.ReactElement<P>;
}

/**
 * Field: label above control, persistent helper text, error text.
 * Wires aria-describedby and aria-invalid onto the control so the
 * association survives independent of visual layout.
 */
export function Field<P extends FieldControlProps>({
  id,
  label,
  helper,
  error,
  required,
  className,
  children,
}: FieldProps<P>) {
  const helperId = helper ? `${id}-helper` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [helperId, errorId].filter(Boolean).join(" ") || undefined;

  // The cast is required here because P is abstract at this point in the
  // function body (TypeScript can't verify a concrete literal against an
  // unresolved type parameter without one). The actual safety net is the
  // `P extends FieldControlProps` constraint on the generic itself, which
  // is checked at each call site against the real child element's props.
  const control = React.cloneElement(children, {
    id,
    "aria-invalid": error ? "true" : undefined,
    "aria-describedby": describedBy,
    "aria-required": required ? "true" : undefined,
  } as Partial<P>);

  // Development-only safety net for the case the type system cannot cover
  // (see the comment on FieldControlProps above): if the child never
  // forwards the injected id to a real DOM node, the label association and
  // aria-describedby wiring silently do nothing. Surface that loudly here
  // instead of leaving it to be discovered later as a clinical intake form
  // that reads wrong to a screen reader.
  React.useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    if (typeof document === "undefined") return;
    if (!document.getElementById(id)) {
      console.error(
        `Field: no element with id "${id}" was found after render. The control passed as ` +
          "Field's child did not forward the id (and aria-invalid/aria-describedby/aria-required) " +
          "props Field injects, so its label and error text are not actually connected to it. " +
          "Pass a native input/textarea/select, or a component that forwards these props to its " +
          "underlying DOM node."
      );
    }
  }, [id]);

  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={id} className="block text-label text-ink">
        {label}
        {required && (
          <span aria-hidden="true" className="text-risk-emergency">
            {" "}
            *
          </span>
        )}
      </label>
      {control}
      {helper && (
        <p id={helperId} className="text-body-sm text-ink-muted">
          {helper}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-body-sm text-risk-emergency">
          {error}
        </p>
      )}
    </div>
  );
}
