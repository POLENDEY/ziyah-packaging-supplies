"use client";

import styles from "./admin.module.css";
import { COLOR_PRESETS, normalizeHex } from "./colorPresets";

export type ProductColorValue = {
  color: string;
  colorHex: string;
  colorHexSecondary: string;
  variantGroup: string;
};

type Props = {
  value: ProductColorValue;
  onChange: (next: ProductColorValue) => void;
  existingGroups: string[];
};

export default function ProductColorFields({
  value,
  onChange,
  existingGroups,
}: Props) {
  const combined = Boolean(value.colorHexSecondary.trim());
  const primary = normalizeHex(value.colorHex || "#cccccc");
  const secondary = normalizeHex(value.colorHexSecondary || "#1c141f");

  const set = (patch: Partial<ProductColorValue>) =>
    onChange({ ...value, ...patch });

  const previewStyle = combined
    ? {
        backgroundImage: `linear-gradient(to right, ${primary} 0 50%, ${secondary} 50% 100%)`,
      }
    : { background: primary };

  return (
    <div className={styles.colorBlock}>
      <label>Color</label>
      <div className={styles.colorPresets} role="group" aria-label="Color presets">
        {COLOR_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            className={styles.colorPresetBtn}
            title={preset.label}
            aria-label={`Preset ${preset.label}`}
            onClick={() =>
              set({
                color: preset.color,
                colorHex: preset.colorHex,
                colorHexSecondary: preset.colorHexSecondary || "",
              })
            }
          >
            <span
              className={styles.colorPresetSwatch}
              style={
                preset.colorHexSecondary
                  ? {
                      backgroundImage: `linear-gradient(to right, ${preset.colorHex} 0 50%, ${preset.colorHexSecondary} 50% 100%)`,
                    }
                  : { background: preset.colorHex }
              }
            />
            <span>{preset.label}</span>
          </button>
        ))}
        <button
          type="button"
          className={styles.colorPresetBtn}
          onClick={() =>
            set({
              color: value.color || "Custom",
              colorHex: primary,
              colorHexSecondary: "",
            })
          }
        >
          <span
            className={styles.colorPresetSwatch}
            style={{
              background:
                "conic-gradient(red, yellow, lime, aqua, blue, magenta, red)",
            }}
          />
          <span>Custom</span>
        </button>
      </div>

      <div className={styles.colorNameRow}>
        <div className={styles.formGroup}>
          <label htmlFor="product-color-name">Color name</label>
          <input
            id="product-color-name"
            value={value.color}
            onChange={(e) => set({ color: e.target.value })}
            placeholder="e.g. Clear, Black, Red & Black"
          />
        </div>
        <div
          className={styles.colorLivePreview}
          style={previewStyle}
          title={value.color || "Swatch preview"}
          aria-hidden="true"
        />
      </div>

      <div className={styles.colorPickerRow}>
        <div className={styles.formGroup}>
          <label htmlFor="product-color-hex">Primary color</label>
          <div className={styles.colorInputs}>
            <input
              id="product-color-picker"
              type="color"
              value={primary}
              onChange={(e) => set({ colorHex: e.target.value })}
              aria-label="Primary color picker"
            />
            <input
              id="product-color-hex"
              value={value.colorHex}
              onChange={(e) => set({ colorHex: e.target.value })}
              onBlur={() => set({ colorHex: normalizeHex(value.colorHex) })}
              placeholder="#rrggbb"
            />
          </div>
        </div>
      </div>

      <label className={styles.checkLabel}>
        <input
          type="checkbox"
          checked={combined}
          onChange={(e) =>
            set({
              colorHexSecondary: e.target.checked
                ? value.colorHexSecondary.trim() || "#1c141f"
                : "",
            })
          }
        />
        Combined color (split swatch)
      </label>

      {combined && (
        <div className={styles.colorPickerRow}>
          <div className={styles.formGroup}>
            <label htmlFor="product-color-hex-2">Secondary color</label>
            <div className={styles.colorInputs}>
              <input
                id="product-color-picker-2"
                type="color"
                value={secondary}
                onChange={(e) => set({ colorHexSecondary: e.target.value })}
                aria-label="Secondary color picker"
              />
              <input
                id="product-color-hex-2"
                value={value.colorHexSecondary}
                onChange={(e) => set({ colorHexSecondary: e.target.value })}
                onBlur={() =>
                  set({
                    colorHexSecondary: normalizeHex(value.colorHexSecondary),
                  })
                }
                placeholder="#rrggbb"
              />
            </div>
          </div>
        </div>
      )}

      <div className={styles.formGroup}>
        <label htmlFor="product-variant-group">Variant group</label>
        <p className={styles.help}>
          Products with the same key appear as color swatches together on the
          product page.
        </p>
        <input
          id="product-variant-group"
          value={value.variantGroup}
          onChange={(e) => set({ variantGroup: e.target.value })}
          placeholder="e.g. hard-bento-4div"
          list="existing-variant-groups"
        />
        {existingGroups.length > 0 && (
          <>
            <datalist id="existing-variant-groups">
              {existingGroups.map((g) => (
                <option key={g} value={g} />
              ))}
            </datalist>
            <label htmlFor="pick-variant-group" className={styles.srOnly}>
              Use existing group
            </label>
            <select
              id="pick-variant-group"
              className={styles.variantGroupSelect}
              value=""
              onChange={(e) => {
                if (e.target.value) set({ variantGroup: e.target.value });
              }}
            >
              <option value="">Use existing group…</option>
              {existingGroups.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </>
        )}
      </div>
    </div>
  );
}
