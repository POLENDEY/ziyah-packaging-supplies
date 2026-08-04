"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getProductHref,
  getProductImageAlt,
  products,
} from "@/data/products";
import ProtectedProductImage from "./ProtectedProductImage";
import { IconSearch } from "./Icons";
import styles from "./ProductSearch.module.css";

type Props = {
  className?: string;
  onNavigate?: () => void;
  /** Desktop: show search icon that expands into the input */
  collapsible?: boolean;
};

export default function ProductSearch({
  className = "",
  onNavigate,
  collapsible = false,
}: Props) {
  const router = useRouter();
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [resultsOpen, setResultsOpen] = useState(false);
  const [expanded, setExpanded] = useState(!collapsible);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter((p) =>
        [p.name, p.category, p.desc].some((field) => field.toLowerCase().includes(q))
      )
      .slice(0, 8);
  }, [query]);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setResultsOpen(false);
        if (collapsible && !query.trim()) setExpanded(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [collapsible, query]);

  useEffect(() => {
    if (expanded && collapsible) {
      inputRef.current?.focus();
    }
  }, [expanded, collapsible]);

  const goTo = (href: string) => {
    setResultsOpen(false);
    setQuery("");
    if (collapsible) setExpanded(false);
    onNavigate?.();
    router.push(href);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setResultsOpen(false);
      if (collapsible) {
        setExpanded(false);
        setQuery("");
      }
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const q = query.trim();
      if (results[0] && q.length < 2) {
        goTo(getProductHref(results[0]));
        return;
      }
      if (q) {
        goTo(`/products?q=${encodeURIComponent(q)}`);
        return;
      }
      if (results[0]) goTo(getProductHref(results[0]));
    }
  };

  const toggleExpand = () => {
    setExpanded((v) => {
      const next = !v;
      if (!next) {
        setQuery("");
        setResultsOpen(false);
      }
      return next;
    });
  };

  return (
    <div
      ref={rootRef}
      className={`${styles.root} ${collapsible ? styles.collapsible : ""} ${
        expanded ? styles.expanded : ""
      } ${className}`.trim()}
    >
      {collapsible && (
        <button
          type="button"
          className={styles.iconBtn}
          onClick={toggleExpand}
          aria-label={expanded ? "Close search" : "Open search"}
          aria-expanded={expanded}
        >
          {expanded ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          ) : (
            <IconSearch size={18} />
          )}
        </button>
      )}

      <div className={`${styles.field} ${expanded ? styles.fieldOpen : styles.fieldClosed}`}>
        <label className={styles.label} htmlFor={`${listId}-input`}>
          Search products
        </label>
        <input
          ref={inputRef}
          id={`${listId}-input`}
          type="search"
          className={styles.input}
          placeholder="Search products..."
          value={query}
          autoComplete="off"
          role="combobox"
          aria-expanded={resultsOpen && query.trim().length > 0}
          aria-controls={listId}
          aria-autocomplete="list"
          tabIndex={expanded ? 0 : -1}
          onChange={(e) => {
            setQuery(e.target.value);
            setResultsOpen(true);
          }}
          onFocus={() => setResultsOpen(true)}
          onKeyDown={onKeyDown}
        />
      </div>

      {expanded && resultsOpen && query.trim().length > 0 && (
        <div className={styles.dropdown} role="listbox" id={listId}>
          {results.length === 0 ? (
            <p className={styles.empty}>No products found</p>
          ) : (
            results.map((product) => (
              <Link
                key={product.id}
                href={getProductHref(product)}
                role="option"
                className={styles.result}
                onClick={() => {
                  setResultsOpen(false);
                  setQuery("");
                  if (collapsible) setExpanded(false);
                  onNavigate?.();
                }}
              >
                <span className={styles.thumb}>
                  <ProtectedProductImage
                    src={product.images[0]}
                    alt={getProductImageAlt(product.name, product.images[0], 0)}
                    width={40}
                    height={40}
                  />
                </span>
                <span className={styles.meta}>
                  <span className={styles.name}>{product.name}</span>
                  <span className={styles.category}>{product.category}</span>
                </span>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
