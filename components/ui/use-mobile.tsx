"use client"

import { useMediaQuery } from "@uidotdev/usehooks"

export function useMobile() {
  return useMediaQuery("(max-width: 768px)")
}
