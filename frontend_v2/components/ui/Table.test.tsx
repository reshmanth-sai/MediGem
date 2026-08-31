import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Table, THead, TH, TBody, TR, TD } from "./Table";

describe("Table", () => {
  it("exposes sort state to assistive tech", () => {
    render(
      <Table caption="Patient queue">
        <THead><tr><TH sortable sortDirection="asc">Urgency</TH></tr></THead>
        <TBody><TR><TD>9.8</TD></TR></TBody>
      </Table>
    );
    expect(screen.getByRole("columnheader")).toHaveAttribute("aria-sort", "ascending");
  });

  it("gives numeric cells tabular figures", () => {
    render(
      <Table caption="Q">
        <TBody><TR><TD numeric>165/102</TD></TR></TBody>
      </Table>
    );
    expect(screen.getByRole("cell").className).toContain("tabular");
  });

  it("offsets sticky-header scroll so focus is never obscured", () => {
    const { container } = render(<Table caption="Q"><TBody><TR><TD>x</TD></TR></TBody></Table>);
    expect(container.firstElementChild?.className).toContain("scroll-pt-");
  });

  it("always has a caption", () => {
    render(<Table caption="Patient queue"><TBody><TR><TD>x</TD></TR></TBody></Table>);
    expect(screen.getByText("Patient queue")).toBeInTheDocument();
  });

  it("keeps the selected background winning over zebra striping on both even and odd rows", () => {
    render(
      <Table caption="Q">
        <TBody>
          <TR selected data-testid="odd-position-selected"><TD>row 1</TD></TR>
          <TR><TD>row 2</TD></TR>
          <TR><TD>row 3</TD></TR>
          <TR selected data-testid="even-position-selected"><TD>row 4</TD></TR>
        </TBody>
      </Table>
    );
    const oddPositionSelected = screen.getByTestId("odd-position-selected");
    const evenPositionSelected = screen.getByTestId("even-position-selected");

    // `even:bg-ground` compiles to `.even\:bg-ground:nth-child(2n)`, a class
    // plus a pseudo-class (specificity 0-2-0). A plain `bg-action-subtle`
    // (specificity 0-1-0) loses to that on every even-positioned row
    // regardless of source order, so the selected fill must use Tailwind's
    // `!` important modifier to win the cascade unconditionally. Checking
    // for the literal `!`-prefixed class (not just `bg-action-subtle`,
    // which would also match the un-prefixed, losing class) proves the fix
    // is present on a row landing at an even nth-child position (row 4,
    // the case that silently failed before this fix) as well as one at an
    // odd position (row 1).
    expect(oddPositionSelected.className).toContain("!bg-action-subtle");
    expect(evenPositionSelected.className).toContain("!bg-action-subtle");

    // Both rows also keep the always-on zebra class in their class list
    // (removing it is not the fix; only the important modifier needs to
    // win the cascade), confirming this is genuinely a specificity fix and
    // not a rewrite that stops applying zebra striping to selected rows.
    expect(oddPositionSelected.className).toContain("even:bg-ground");
    expect(evenPositionSelected.className).toContain("even:bg-ground");
  });
});
