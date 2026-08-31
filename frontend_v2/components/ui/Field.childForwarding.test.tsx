import React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render } from "@testing-library/react";
import { Field } from "./Field";

// This suite exists because of a code review finding on Field.tsx:
// FieldProps.children was originally typed React.ReactElement<any>, so
// React.cloneElement's injected id/aria-* props were never checked against
// the actual child's prop shape. Tightening that type to a generic
// constrained by FieldControlProps (see Field.tsx) only protects call
// sites where TypeScript can resolve a concrete prop type for the child
// from something other than a bare inline JSX expression -- every JSX
// element (custom or intrinsic) has the same static type, JSX.Element
// (= React.ReactElement<any, any>), so `<Field><BadComponent /></Field>`
// does not produce a compile error no matter how the constraint is
// shaped. This is confirmed against this project's TypeScript (5.9.3):
//   const el = <input id="x" />;
//   const forceError: number = el; // Type 'Element' is not assignable to 'number'.
// proving even a plain <input> collapses to the same erased type as a
// custom component with an incompatible prop shape.
//
// Given the compiler cannot catch this, Field carries a dev-mode runtime
// guard instead: after render, if no element with the expected id exists
// in the DOM, it logs a console.error. These tests prove that guard
// actually fires for a non-forwarding child, and stays silent for a
// forwarding one.

describe("Field runtime guard for a non-forwarding child", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("warns when the child does not forward id to a DOM node", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    function NonForwarding(_props: { value: string }) {
      return <div>static</div>;
    }

    render(
      <Field id="age" label="Age">
        <NonForwarding value="z" />
      </Field>
    );

    const calls = errorSpy.mock.calls.map((args) => String(args[0]));
    expect(calls.some((msg) => msg.includes('no element with id "age"'))).toBe(true);
  });

  it("stays silent when the child forwards id to a DOM node", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <Field id="age" label="Age">
        <input />
      </Field>
    );

    const calls = errorSpy.mock.calls.map((args) => String(args[0]));
    expect(calls.some((msg) => msg.includes('no element with id "age"'))).toBe(false);
  });
});
