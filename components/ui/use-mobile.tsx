"use client"

import { useMediaQuery } from "@uidotdev/usehooks"

export function useMobile() {
  return useMediaQuery("only screen and (max-width : 768px)")
}
