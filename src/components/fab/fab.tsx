import { Component, Element, Method, Prop, h, VNode } from "@stencil/core";
import { Appearance, Scale } from "../interfaces";
import { ButtonColor } from "../button/interfaces";
import { CSS, ICONS } from "./resources";
import { focusElement } from "../../utils/dom";

@Component({
  tag: "calcite-fab",
  styleUrl: "fab.scss",
  shadow: true
})
export class Fab {
  // --------------------------------------------------------------------------
  //
  //  Properties
  //
  // --------------------------------------------------------------------------

  /**
   * Used to set the button's appearance. Default is outline.
   */
  @Prop({ reflect: true }) appearance: Extract<"solid" | "outline", Appearance> = "outline";

  /**
   * Used to set the button's color. Default is light.
   */
  @Prop({ reflect: true }) color: ButtonColor = "neutral";

  /**
   * When true, disabled prevents interaction. This state shows items with lower opacity/grayed.
   */
  @Prop({ reflect: true }) disabled = false;

  /**
   * The name of the icon to display. The value of this property must match the icon name from https://esri.github.io/calcite-ui-icons/.
   * @default "plus"
   */
  @Prop() icon?: string = ICONS.plus;

  /**
   * Label of the FAB, exposed on hover when textEnabled is false. If no label is provided, the label inherits what's provided for the `text` prop.
   */
  @Prop() label?: string;

  /**
   * When true, content is waiting to be loaded. This state shows a busy indicator.
   */
  @Prop({ reflect: true }) loading = false;

  /**
   * Specifies the size of the fab.
   */
  @Prop({ reflect: true }) scale: Scale = "m";

  /**
   * Text that accompanies the FAB icon.
   */
  @Prop() text?: string;

  /**
   * Indicates whether the text is displayed.
   */
  @Prop({ reflect: true }) textEnabled = false;

  // --------------------------------------------------------------------------
  //
  //  Private Properties
  //
  // --------------------------------------------------------------------------

  @Element() el: HTMLCalciteFabElement;

  private buttonEl: HTMLElement;

  // --------------------------------------------------------------------------
  //
  //  Methods
  //
  // --------------------------------------------------------------------------

  /** Sets focus on the component. */
  @Method()
  async setFocus(): Promise<void> {
    focusElement(this.buttonEl);
  }

  // --------------------------------------------------------------------------
  //
  //  Render Methods
  //
  // --------------------------------------------------------------------------

  render(): VNode {
    const { appearance, color, disabled, loading, scale, textEnabled, icon, label, text } = this;
    const title = !textEnabled ? label || text || null : null;

    return (
      <calcite-button
        appearance={appearance === "solid" ? "solid" : "outline"}
        class={CSS.button}
        color={color}
        disabled={disabled}
        iconStart={icon}
        label={label}
        loading={loading}
        ref={(buttonEl): void => {
          this.buttonEl = buttonEl;
        }}
        round={true}
        scale={scale}
        title={title}
        width="auto"
      >
        {this.textEnabled ? this.text : null}
      </calcite-button>
    );
  }
}