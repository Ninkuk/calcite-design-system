import { accessible, labelable, renders } from "../../tests/commonTests";
import { E2EPage } from "@stencil/core/testing";
import { newE2EPage } from "@stencil/core/testing";
import { CSS } from "./resources";
import { html } from "../../tests/utils";

describe("calcite-inline-editable", () => {
  it("renders", () =>
    renders(
      html`
        <calcite-inline-editable>
          <calcite-input />
        </calcite-inline-editable>
      `,
      { display: "block" }
    ));

  describe("rendering permutations", () => {
    let page: E2EPage;
    beforeEach(async () => {
      page = await newE2EPage();
      await page.setContent(`
      <calcite-inline-editable>
        <calcite-input/>
      </calcite-inline-editable>
      `);
    });

    it("renders default props when none are provided", async () => {
      const element = await page.find("calcite-inline-editable");
      await page.waitForChanges();
      expect(element).not.toHaveAttribute("controls");
      expect(element).not.toHaveAttribute("editing-enabled");
      expect(element).not.toHaveAttribute("loading");
    });

    it("uses a wrapping label's scale when none are provided", async () => {
      page = await newE2EPage();
      await page.setContent(`
      <calcite-label scale="l">
        <calcite-inline-editable>
          <calcite-input/>
        </calcite-inline-editable>
      </calcite-label>
      `);
      await page.waitForChanges();
      const element = await page.find("calcite-inline-editable");
      expect(element).toEqualAttribute("scale", "l");
    });

    it("uses a child input's scale when none are provided", async () => {
      page = await newE2EPage();
      await page.setContent(`
      <calcite-label>
        <calcite-inline-editable>
          <calcite-input scale="l"/>
        </calcite-inline-editable>
      </calcite-label>
      `);
      await page.waitForChanges();
      const element = await page.find("calcite-inline-editable");
      expect(element).toEqualAttribute("scale", "l");
    });

    it("renders requested props when valid props are provided", async () => {
      page = await newE2EPage();
      await page.setContent(`
      <calcite-inline-editable controls editing-enabled loading disabled scale="l" >
        <calcite-input/>
      </calcite-inline-editable>
      `);
      await page.waitForChanges();
      const element = await page.find("calcite-inline-editable");
      expect(element).toEqualAttribute("scale", "l");
      expect(element).toHaveAttribute("controls");
      expect(element).toHaveAttribute("editing-enabled");
      expect(element).toHaveAttribute("loading");
      expect(element).toHaveAttribute("disabled");
    });
  });

  describe("does not have controls", () => {
    let page: E2EPage;
    beforeEach(async () => {
      page = await newE2EPage();
      await page.setContent(`
      <calcite-inline-editable>
        <calcite-input value="John Doe"/>
      </calcite-inline-editable>
      `);
    });

    it("enables editing when enable button is clicked", async () => {
      const calciteInlineEditableEnableEditingChange = await page.spyOnEvent(
        "calciteInlineEditableEnableEditingChange"
      );
      const element = await page.find("calcite-inline-editable");
      const enableEditingButton = await page.find(`calcite-inline-editable >>> .${CSS.enableEditingButton}`);
      await enableEditingButton.click();
      expect(element).toHaveAttribute("editing-enabled");
      expect(calciteInlineEditableEnableEditingChange).toHaveReceivedEventTimes(1);
    });

    it("enables editing when the child input is clicked", async () => {
      const calciteInlineEditableEnableEditingChange = await page.spyOnEvent(
        "calciteInlineEditableEnableEditingChange"
      );
      const element = await page.find("calcite-inline-editable");
      await element.click();
      expect(element).toHaveAttribute("editing-enabled");
      expect(calciteInlineEditableEnableEditingChange).toHaveReceivedEventTimes(1);
    });

    it("prevents editing when the component is disabled", async () => {
      page = await newE2EPage();
      await page.setContent(`
      <calcite-inline-editable disabled>
        <calcite-input value="John Doe"/>
      </calcite-inline-editable>
      `);
      const calciteInlineEditableEnableEditingChange = await page.spyOnEvent(
        "calciteInlineEditableEnableEditingChange"
      );
      const element = await page.find("calcite-inline-editable");
      const input = await page.find("calcite-input");
      await element.click();
      expect(element).not.toHaveAttribute("editing-enabled");
      expect(input).toHaveAttribute("disabled");
      expect(calciteInlineEditableEnableEditingChange).toHaveReceivedEventTimes(0);
      element.setProperty("disabled", false);
      await page.waitForChanges();
      await element.click();
      expect(element).toHaveAttribute("editing-enabled");
      expect(input).not.toHaveAttribute("disabled");
      expect(calciteInlineEditableEnableEditingChange).toHaveReceivedEventTimes(1);
    });

    it("disables editing when the child input loses focus", async () => {
      const element = await page.find("calcite-inline-editable");
      const input = await page.find("calcite-input");
      const enableEditingButton = await page.find(`calcite-inline-editable >>> .${CSS.enableEditingButton}`);
      await enableEditingButton.click();
      expect(element).toHaveAttribute("editing-enabled");
      input.triggerEvent("calciteInputBlur");
      await page.waitForChanges();
      expect(element).not.toHaveAttribute("editing-enabled");
    });

    describe("accessibility", () => {
      it("is accessible", async () =>
        accessible(html`
          <calcite-label>
            Label
            <calcite-inline-editable>
              <calcite-input value="John Doe"></calcite-input>
            </calcite-inline-editable>
          </calcite-label>
        `));

      it("is accessible when editing is enabled", async () =>
        accessible(html`
          <calcite-label>
            Label
            <calcite-inline-editable editing-enabled>
              <calcite-input value="John Doe"></calcite-input>
            </calcite-inline-editable>
          </calcite-label>
        `));
    });
  });

  describe("has controls", () => {
    let page: E2EPage;
    beforeEach(async () => {
      page = await newE2EPage();
      await page.setContent(`
      <calcite-inline-editable controls>
        <calcite-input value="John Doe"/>
      </calcite-inline-editable>
      `);
    });

    it("enables editing when enable button is clicked", async () => {
      const calciteInlineEditableEnableEditingChange = await page.spyOnEvent(
        "calciteInlineEditableEnableEditingChange"
      );
      const element = await page.find("calcite-inline-editable");
      const enableEditingButton = await page.find(`calcite-inline-editable >>> .${CSS.enableEditingButton}`);
      await enableEditingButton.click();
      expect(element).toHaveAttribute("editing-enabled");
      expect(calciteInlineEditableEnableEditingChange).toHaveReceivedEventTimes(1);
    });

    it("enables editing when the child input is clicked", async () => {
      const calciteInlineEditableEnableEditingChange = await page.spyOnEvent(
        "calciteInlineEditableEnableEditingChange"
      );
      const element = await page.find("calcite-inline-editable");
      await element.click();
      expect(element).toHaveAttribute("editing-enabled");
      expect(calciteInlineEditableEnableEditingChange).toHaveReceivedEventTimes(1);
    });

    it("restores input value after cancel button is clicked", async () => {
      const calciteInlineEditableEditCancel = await page.spyOnEvent("calciteInlineEditableEditCancel");
      const element = await page.find("calcite-inline-editable");
      const input = await element.find("calcite-input");
      await element.click();
      const cancelEditingButton = await page.find(`calcite-inline-editable >>> .${CSS.cancelEditingButton}`);
      expect(await input.getProperty("value")).toBe("John Doe");
      await page.$eval("calcite-input", (element: HTMLCalciteInputElement): void => {
        const input = element.shadowRoot.querySelector("input");
        input.setSelectionRange(input.value.length, input.value.length);
      });
      await input.type("typo");
      expect(await input.getProperty("value")).toBe("John Doetypo");
      const cancelEvent = page.waitForEvent("calciteInlineEditableEditCancel");
      await cancelEditingButton.click();
      await cancelEvent;
      expect(await input.getProperty("value")).toBe("John Doe");
      expect(calciteInlineEditableEditCancel).toHaveReceivedEventTimes(1);
    });

    it("restores input value after escape key is pressed", async () => {
      const calciteInlineEditableEditCancel = await page.spyOnEvent("calciteInlineEditableEditCancel");
      const element = await page.find("calcite-inline-editable");
      const input = await element.find("calcite-input");
      await element.click();
      expect(await input.getProperty("value")).toBe("John Doe");
      await page.$eval("calcite-input", (element: HTMLCalciteInputElement): void => {
        const input = element.shadowRoot.querySelector("input");
        input.setSelectionRange(input.value.length, input.value.length);
      });
      await input.type("typo");
      expect(await input.getProperty("value")).toBe("John Doetypo");
      const cancelEvent = page.waitForEvent("calciteInlineEditableEditCancel");
      await page.keyboard.press("Escape");
      await cancelEvent;
      expect(await input.getProperty("value")).toBe("John Doe");
      expect(calciteInlineEditableEditCancel).toHaveReceivedEventTimes(1);
    });

    it("does not disable editing when input focus is lost", async () => {
      const element = await page.find("calcite-inline-editable");
      const input = await page.find("calcite-input");
      const enableEditingButton = await page.find(`calcite-inline-editable >>> .${CSS.enableEditingButton}`);
      await enableEditingButton.click();
      expect(element).toHaveAttribute("editing-enabled");
      input.triggerEvent("calciteInputBlur");
      await page.waitForChanges();
      expect(element).toHaveAttribute("editing-enabled");
    });

    it("emits a confirm changes event when the save button is clicked", async () => {
      const calciteInlineEditableEditConfirm = await page.spyOnEvent("calciteInlineEditableEditConfirm");
      const element = await page.find("calcite-inline-editable");
      const input = await page.find("calcite-input");
      const enableEditingButton = await page.find(`calcite-inline-editable >>> .${CSS.enableEditingButton}`);
      await enableEditingButton.click();
      const confirmChangesButton = await page.find("calcite-inline-editable >>> .confirm-changes-button");
      await page.$eval("calcite-input", (element: HTMLCalciteInputElement): void => {
        const input = element.shadowRoot.querySelector("input");
        input.setSelectionRange(input.value.length, input.value.length);
      });
      await input.type("Moe");
      await confirmChangesButton.click();
      expect(calciteInlineEditableEditConfirm).toHaveReceivedEventTimes(1);
      expect(await input.getProperty("value")).toBe("John DoeMoe");
      expect(element).toHaveAttribute("editing-enabled");
    });

    it("disables editing when afterConfirm resolves successfully", async () => {
      const element = await page.find("calcite-inline-editable");
      const afterConfirm: () => Promise<void> = () => new Promise((resolve) => global.setTimeout(resolve, 100));
      // https://github.com/ionic-team/stencil/issues/1174
      await page.exposeFunction("afterConfirm", afterConfirm);
      await page.$eval("calcite-inline-editable", (el: HTMLCalciteInlineEditableElement) => {
        el.afterConfirm = afterConfirm;
      });
      const calciteInlineEditableEditConfirm = await page.spyOnEvent("calciteInlineEditableEditConfirm");
      const input = await page.find("calcite-input");
      const enableEditingButton = await page.find(`calcite-inline-editable >>> .${CSS.enableEditingButton}`);
      await enableEditingButton.click();
      const confirmChangesButton = await page.find("calcite-inline-editable >>> .confirm-changes-button");
      await page.$eval("calcite-input", (element: HTMLCalciteInputElement): void => {
        const input = element.shadowRoot.querySelector("input");
        input.setSelectionRange(input.value.length, input.value.length);
      });
      await input.type("Moe");
      await confirmChangesButton.click();
      expect(calciteInlineEditableEditConfirm).toHaveReceivedEventTimes(1);
      await page.waitForChanges();
      expect(await input.getProperty("value")).toBe("John DoeMoe");
      expect(element).not.toHaveAttribute("editing-enabled");
    });

    it("does not disable editing when afterConfirm resolves unsuccessfully", async () => {
      const element = await page.find("calcite-inline-editable");
      const afterConfirm: () => Promise<void> = () => new Promise((_resolve, reject) => global.setTimeout(reject, 100));
      // https://github.com/ionic-team/stencil/issues/1174
      await page.exposeFunction("afterConfirm", afterConfirm);
      await page.$eval("calcite-inline-editable", (el: HTMLCalciteInlineEditableElement) => {
        el.afterConfirm = afterConfirm;
      });
      const calciteInlineEditableEditConfirm = await page.spyOnEvent("calciteInlineEditableEditConfirm");
      const input = await page.find("calcite-input");
      const enableEditingButton = await page.find(`calcite-inline-editable >>> .${CSS.enableEditingButton}`);
      await enableEditingButton.click();
      const confirmChangesButton = await page.find("calcite-inline-editable >>> .confirm-changes-button");
      await page.$eval("calcite-input", (element: HTMLCalciteInputElement): void => {
        const input = element.shadowRoot.querySelector("input");
        input.setSelectionRange(input.value.length, input.value.length);
      });
      await input.type("Moe");
      await confirmChangesButton.click();
      expect(calciteInlineEditableEditConfirm).toHaveReceivedEventTimes(1);
      await page.waitForChanges();
      expect(await input.getProperty("value")).toBe("John DoeMoe");
      expect(element).toHaveAttribute("editing-enabled");
    });

    describe("accessibility", () => {
      it("is accessible", async () =>
        accessible(html`
          <calcite-label controls>
            Label
            <calcite-inline-editable>
              <calcite-input value="John Doe"></calcite-input>
            </calcite-inline-editable>
          </calcite-label>
        `));

      it("is accessible when editing is enabled", async () =>
        accessible(html`
          <calcite-label controls editing-enabled>
            Label
            <calcite-inline-editable editing-enabled>
              <calcite-input value="John Doe"></calcite-input>
            </calcite-inline-editable>
          </calcite-label>
        `));

      describe("labelable", () => {
        it("default", async () =>
          labelable(
            `<calcite-inline-editable controls>
              <calcite-input value="John Doe"></calcite-input>
            </calcite-inline-editable>`
          ));

        it("when editing is enabled", async () =>
          labelable(
            `<calcite-inline-editable controls editing-enabled>
            <calcite-input value="John Doe"></calcite-input>
          </calcite-inline-editable>`,
            {
              focusTargetSelector: "calcite-input"
            }
          ));
      });
    });
  });
});