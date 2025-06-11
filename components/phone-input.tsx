"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/hooks/use-language"

export interface CountryCode {
  code: string
  flag: string
  name: string
  format: string
}

interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
  countryCode?: string
  onCountryCodeChange?: (code: string) => void
  error?: boolean
  errorMessage?: string
  placeholder?: string
  id?: string
}

export const countryCodes: CountryCode[] = [
  { code: "+1", flag: "🇺🇸", name: "USA/Canada", format: "XXX-XXX-XXXX" },
  { code: "+55", flag: "🇧🇷", name: "Brasil", format: "(XX) XXXXX-XXXX" },
  { code: "+54", flag: "🇦🇷", name: "Argentina", format: "XX XXXX-XXXX" },
  { code: "+591", flag: "🇧🇴", name: "Bolivia", format: "X XXX-XXXX" },
  { code: "+56", flag: "🇨🇱", name: "Chile", format: "X XXXX-XXXX" },
  { code: "+57", flag: "🇨🇴", name: "Colombia", format: "XXX XXX-XXXX" },
  { code: "+506", flag: "🇨🇷", name: "Costa Rica", format: "XXXX-XXXX" },
  { code: "+53", flag: "🇨🇺", name: "Cuba", format: "X XXX-XXXX" },
  { code: "+593", flag: "🇪🇨", name: "Ecuador", format: "XX XXX-XXXX" },
  { code: "+503", flag: "🇸🇻", name: "El Salvador", format: "XXXX-XXXX" },
  { code: "+502", flag: "🇬🇹", name: "Guatemala", format: "XXXX-XXXX" },
  { code: "+504", flag: "🇭🇳", name: "Honduras", format: "XXXX-XXXX" },
  { code: "+52", flag: "🇲🇽", name: "Mexico", format: "XXX XXX-XXXX" },
  { code: "+505", flag: "🇳🇮", name: "Nicaragua", format: "XXXX-XXXX" },
  { code: "+507", flag: "🇵🇦", name: "Panama", format: "XXXX-XXXX" },
  { code: "+595", flag: "🇵🇾", name: "Paraguay", format: "XXX XXX-XXX" },
  { code: "+51", flag: "🇵🇪", name: "Peru", format: "XXX XXX-XXX" },
  { code: "+1787", flag: "🇵🇷", name: "Puerto Rico", format: "XXX-XXX-XXXX" },
  { code: "+1809", flag: "🇩🇴", name: "Dominican Republic", format: "XXX-XXX-XXXX" },
  { code: "+598", flag: "🇺🇾", name: "Uruguay", format: "X XXX-XXXX" },
  { code: "+58", flag: "🇻🇪", name: "Venezuela", format: "XXX XXX-XXXX" },
]

export function formatPhoneNumber(phone: string, format: string): string {
  let formattedNumber = ""
  let phoneIndex = 0

  for (let i = 0; i < format.length && phoneIndex < phone.length; i++) {
    if (format[i] === "X") {
      formattedNumber += phone[phoneIndex]
      phoneIndex++
    } else {
      formattedNumber += format[i]
      // If we're at the end of the input but there are more format characters
      if (phoneIndex === phone.length && i < format.length - 1) {
        break
      }
    }
  }

  return formattedNumber
}

export function PhoneInput({
  value,
  onChange,
  countryCode = "+55",
  onCountryCodeChange = () => {},
  error = false,
  errorMessage,
  placeholder,
  id = "phone",
}: PhoneInputProps) {
  const { t } = useLanguage()
  const [formattedValue, setFormattedValue] = useState("")

  useEffect(() => {
    const selectedCountry = countryCodes.find((c) => c.code === countryCode)
    if (selectedCountry && value) {
      setFormattedValue(formatPhoneNumber(value, selectedCountry.format))
    } else {
      setFormattedValue(value)
    }
  }, [value, countryCode])

  const getPlaceholder = () => {
    const selectedCountry = countryCodes.find((c) => c.code === countryCode)
    if (placeholder) return placeholder
    if (selectedCountry) return selectedCountry.format.replace(/X/g, "0")
    return "000000000"
  }

  return (
    <div className="grid gap-1">
      <div className="flex gap-2">
        <Select value={countryCode} onValueChange={onCountryCodeChange}>
          <SelectTrigger className="w-[90px]">
            <SelectValue>{countryCodes.find((c) => c.code === countryCode)?.flag || "🌍"}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {countryCodes.map((country) => (
              <SelectItem key={country.code} value={country.code}>
                {country.flag} {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex-1">
          <Input
            id={id}
            type="tel"
            value={formattedValue}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, "")
              onChange(digits)
            }}
            className={error ? "border-red-500" : ""}
            placeholder={getPlaceholder()}
          />
          {error && errorMessage && <p className="text-red-500 text-[10px] mt-1">{errorMessage}</p>}
        </div>
      </div>
    </div>
  )
}
