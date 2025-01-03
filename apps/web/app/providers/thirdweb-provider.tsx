'use client'
import { defineChain } from 'thirdweb'
import { ChainProvider as ChainProviderBase, ThirdwebProvider as ThirdwebProviderBase } from 'thirdweb/react'

export function ThirdwebProvider({ children }: { children: React.ReactNode }): JSX.Element {
  return <ThirdwebProviderBase>{children}</ThirdwebProviderBase>
}

export function ChainProvider({ children }: { children: React.ReactNode }): JSX.Element {
  return <ChainProviderBase chain={defineChain(28122024)}>{children}</ChainProviderBase>
}
