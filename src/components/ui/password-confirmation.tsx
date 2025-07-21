import * as React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Eye, EyeOff, AlertCircle } from "lucide-react"

interface PasswordConfirmationProps {
  name: string
  label: string
  placeholder?: string
  required?: boolean
  value: string
  onValueChange: (value: string) => void
  className?: string
}

export const PasswordConfirmation = React.forwardRef<
  HTMLDivElement,
  PasswordConfirmationProps
>(({ name, label, placeholder, required, value, onValueChange, className }, ref) => {
  const [password, setPassword] = React.useState(value || "")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [hasTypedConfirm, setHasTypedConfirm] = React.useState(false)

  // Sync with external value changes
  React.useEffect(() => {
    if (value !== password) {
      setPassword(value || "")
    }
  }, [value])

  const isPasswordMatch = password === confirmPassword
  const showError = hasTypedConfirm && confirmPassword.length > 0 && !isPasswordMatch

  const handlePasswordChange = (newPassword: string) => {
    setPassword(newPassword)
    onValueChange(newPassword)
  }

  const handleConfirmPasswordChange = (newConfirmPassword: string) => {
    setConfirmPassword(newConfirmPassword)
    if (!hasTypedConfirm && newConfirmPassword.length > 0) {
      setHasTypedConfirm(true)
    }
  }

  
  return (
    <div ref={ref} className={cn("space-y-3", className)}>
      <div className="space-y-2">
        <Label htmlFor={name} className="flex items-center gap-1">
          {label}
          {required && <span className="text-destructive">*</span>}
        </Label>
        <div className="relative">
          <Input
            id={name}
            type={showPassword ? "text" : "password"}
            placeholder={placeholder}
            value={password}
            onChange={(e) => handlePasswordChange(e.target.value)}
            className="pr-10 transition-all duration-300 focus:scale-[1.01]"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${name}_confirm`} className="flex items-center gap-1">
          Confirm {label}
          {required && <span className="text-destructive">*</span>}
        </Label>
        <div className="relative">
          <Input
            id={`${name}_confirm`}
            type={showConfirmPassword ? "text" : "password"}
            placeholder={`Confirm ${placeholder || label.toLowerCase()}`}
            value={confirmPassword}
            onChange={(e) => handleConfirmPasswordChange(e.target.value)}
            className={cn(
              "pr-10 transition-all duration-300 focus:scale-[1.01]",
              showError && "border-destructive focus-visible:ring-destructive"
            )}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {showError && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          Passwords do not match
        </div>
      )}
    </div>
  )
})

PasswordConfirmation.displayName = "PasswordConfirmation"