import { useContext } from 'react'
import { LernKontextContext } from '../context/LernKontextProvider'
export function useLernKontext() { return useContext(LernKontextContext) }
