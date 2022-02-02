import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Listen,
  Method,
  Prop,
  VNode,
  Watch
} from "@stencil/core";
import { getElementProp, getSlotted } from "../../utils/dom";
import { Scale } from "../interfaces";
import { TEXT, CSS } from "./resources";
import { connectLabel, disconnectLabel, getLabelText, LabelableComponent } from "../../utils/label";
import { createObserver } from "../../utils/observers";

/**
 * @slot - A slot for adding a `calcite-input`.
 */
@Component({
  tag: "calcite-inline-editable",
  shadow: true,
  styleUrl: "inline-editable.scss"
})
export class InlineEditable implements LabelableComponent {
  //--------------------------------------------------------------------------
  //
  //  Element
  //
  //--------------------------------------------------------------------------

  @Element() el: HTMLCalciteInlineEditableElement;

  //--------------------------------------------------------------------------
  //
  //  Props
  //
  //--------------------------------------------------------------------------

  /** specify whether editing can be enabled */
  @Prop({ reflect: true }) disabled = false;

  @Watch("disabled")
  disabledWatcher(disabled: boolean): void {
    if (this.inputElement) {
      this.inputElement.disabled = disabled;
    }
  }

  /** specify whether the wrapped input element is editable, defaults to false */
  @Prop({ mutable: true, reflect: true }) editingEnabled = false;

  @Watch("editingEnabled")
  editingEnabledWatcher(newValue: boolean, oldValue: boolean): void {
    if (this.inputElement) {
      this.inputElement.editingEnabled = newValue;
    }
    if (!newValue && !!oldValue) {
      this.shouldEmitCancel = true;
    }
  }

  /** specify whether the confirm button should display a loading state, defaults to false */
  @Prop({ mutable: true, reflect: true }) loading = false;

  /** specify whether save/cancel controls should be displayed when editingEnabled is true, defaults to false */
  @Prop({ reflect: true }) controls = false;

  /** specify text to be user for the enable editing button's aria-label, defaults to `Click to edit`
   * @default "Click to edit"
   */
  @Prop({ reflect: true }) intlEnableEditing = TEXT.intlEnablingEditing;

  /** specify text to be user for the cancel editing button's aria-label, defaults to `Cancel`
   * @default "Cancel"
   */
  @Prop({ reflect: true }) intlCancelEditing = TEXT.intlCancelEditing;

  /** specify text to be user for the confirm changes button's aria-label, defaults to `Save`
   * @default "Save"
   */
  @Prop({ reflect: true }) intlConfirmChanges = TEXT.intlConfirmChanges;

  /** specify the scale of the inline-editable component, defaults to the scale of the wrapped calcite-input or the scale of the closest wrapping component with a set scale */
  @Prop({ reflect: true, mutable: true }) scale?: Scale;

  /** when controls, specify a callback to be executed prior to disabling editing. when provided, loading state will be handled automatically. */
  @Prop() afterConfirm?: () => Promise<void>;

  //--------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  //--------------------------------------------------------------------------

  connectedCallback() {
    connectLabel(this);
    this.mutationObserver?.observe(this.el, { childList: true });
    this.mutationObserverCallback();
  }

  disconnectedCallback() {
    disconnectLabel(this);
    this.mutationObserver?.disconnect();
  }

  render(): VNode {
    return (
      <div
        class={CSS.wrapper}
        onClick={this.enableEditingHandler}
        onKeyDown={this.escapeKeyHandler}
        onTransitionEnd={this.transitionEnd}
      >
        <div class={CSS.inputWrapper}>
          <slot />
        </div>
        <div class={CSS.controlsWrapper}>
          <calcite-button
            appearance="transparent"
            class={CSS.enableEditingButton}
            color="neutral"
            disabled={this.disabled}
            iconStart="pencil"
            label={this.intlEnableEditing}
            onClick={this.enableEditingHandler}
            ref={(el) => (this.enableEditingButton = el)}
            scale={this.scale}
            style={{
              opacity: this.editingEnabled ? "0" : "1",
              width: this.editingEnabled ? "0" : "inherit"
            }}
          />
          {this.shouldShowControls && [
            <div class={CSS.cancelEditingButtonWrapper}>
              <calcite-button
                appearance="transparent"
                class={CSS.cancelEditingButton}
                color="neutral"
                disabled={this.disabled}
                iconStart="x"
                label={this.intlCancelEditing}
                onClick={this.cancelEditingHandler}
                ref={(el) => (this.cancelEditingButton = el)}
                scale={this.scale}
              />
            </div>,
            <calcite-button
              appearance="solid"
              class={CSS.confirmChangesButton}
              color="blue"
              disabled={this.disabled}
              iconStart="check"
              label={this.intlConfirmChanges}
              loading={this.loading}
              onClick={this.confirmChangesHandler}
              scale={this.scale}
            />
          ]}
        </div>
      </div>
    );
  }

  //--------------------------------------------------------------------------
  //
  //  Events
  //
  //--------------------------------------------------------------------------

  /**
   * Emitted when the cancel button gets clicked.
   */
  @Event() calciteInlineEditableEditCancel: EventEmitter<void>;

  /**
   * Emitted when the check button gets clicked.
   */
  @Event() calciteInlineEditableEditConfirm: EventEmitter<void>;

  /**
   * @internal
   */
  @Event() calciteInlineEditableEnableEditingChange: EventEmitter;

  //--------------------------------------------------------------------------
  //
  //  Event Listeners
  //
  //--------------------------------------------------------------------------

  @Listen("calciteInputBlur")
  blurHandler(): void {
    if (!this.controls) {
      this.disableEditing();
    }
  }

  //--------------------------------------------------------------------------
  //
  //  Private State
  //
  //--------------------------------------------------------------------------

  private inputElement: HTMLCalciteInputElement;

  private valuePriorToEditing: string;

  private shouldEmitCancel: boolean;

  private enableEditingButton: HTMLCalciteButtonElement;

  private cancelEditingButton: HTMLCalciteButtonElement;

  labelEl: HTMLCalciteLabelElement;

  mutationObserver = createObserver("mutation", () => this.mutationObserverCallback());

  //--------------------------------------------------------------------------
  //
  //  Public Methods
  //
  //--------------------------------------------------------------------------

  @Method()
  async setFocus(): Promise<void> {
    if (this.editingEnabled) {
      this.inputElement?.setFocus();
    } else {
      this.enableEditingButton?.setFocus();
    }
  }

  //--------------------------------------------------------------------------
  //
  //  Private Methods
  //
  //--------------------------------------------------------------------------

  mutationObserverCallback(): void {
    this.updateSlottedInput();
    this.scale =
      this.scale || this.inputElement?.scale || getElementProp(this.el, "scale", undefined);
  }

  onLabelClick(): void {
    this.setFocus();
  }

  updateSlottedInput(): void {
    const inputElement: HTMLCalciteInputElement = getSlotted(this.el, {
      matches: "calcite-input"
    });

    this.inputElement = inputElement;

    if (!inputElement) {
      return;
    }

    this.inputElement.disabled = this.disabled;
    this.inputElement.label = this.inputElement.label || getLabelText(this);
  }

  transitionEnd = (): void => {
    if (!this.editingEnabled && !!this.shouldEmitCancel) {
      this.calciteInlineEditableEditCancel.emit();
    }
  };

  private get shouldShowControls(): boolean {
    return this.editingEnabled && this.controls;
  }

  private enableEditing = () => {
    this.valuePriorToEditing = this.inputElement?.value;
    this.editingEnabled = true;
    this.inputElement?.setFocus();
    this.calciteInlineEditableEnableEditingChange.emit();
  };

  private disableEditing = () => {
    this.editingEnabled = false;
  };

  private cancelEditing = () => {
    if (this.inputElement) {
      this.inputElement.value = this.valuePriorToEditing;
    }
    this.disableEditing();
    this.enableEditingButton.setFocus();
  };

  private escapeKeyHandler = async (e: KeyboardEvent) => {
    if (e.key !== "Escape") {
      if (e.key === "Tab" && this.shouldShowControls) {
        if (!e.shiftKey && e.target === this.inputElement) {
          e.preventDefault();
          this.cancelEditingButton.setFocus();
        }
        if (!!e.shiftKey && e.target === this.cancelEditingButton) {
          e.preventDefault();
          e.stopPropagation();
          this.inputElement?.setFocus();
        }
      }
      return;
    }
    this.cancelEditing();
  };

  private cancelEditingHandler = async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    this.cancelEditing();
  };

  private enableEditingHandler = async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (this.disabled) {
      return;
    }
    if (!this.editingEnabled) {
      this.enableEditing();
    }
  };

  private confirmChangesHandler = async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    this.calciteInlineEditableEditConfirm.emit();
    try {
      if (this.afterConfirm) {
        this.loading = true;
        await this.afterConfirm();
        this.disableEditing();
        this.enableEditingButton.setFocus();
      }
    } catch (e) {
    } finally {
      this.loading = false;
    }
  };
}