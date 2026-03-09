"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Eye, EyeOff, User, Mail, Phone, Lock, CheckCircle, AlertCircle, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function SignupForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return { score: 0, text: "", color: "" };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z\d]/.test(password)) score++;

    const levels = [
      { score: 0, text: "Very Weak", color: "text-red-500" },
      { score: 1, text: "Weak", color: "text-red-400" },
      { score: 2, text: "Fair", color: "text-yellow-500" },
      { score: 3, text: "Good", color: "text-blue-500" },
      { score: 4, text: "Strong", color: "text-green-500" },
      { score: 5, text: "Very Strong", color: "text-green-600" }
    ];

    return levels[score] || levels[0];
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!agreeToTerms) {
      setError("You must agree to the terms and conditions");
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const result = await register({
        email: formData.email,
        password: formData.password,
        name: formData.name || undefined,
        phone: formData.phone || undefined,
      });
      
      if (!result.success) {
        setError(result.message);
      } else {
        router.push("/login?message=Registration successful, please login");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-md">

        <Card className="border-0 shadow-xl bg-white">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-2xl font-bold text-center text-gray-900">
              Create Account
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Join thousands monitoring political finance transparency
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-5">
              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-900">
                  Full Name
                </Label>
                <div className="relative">
                  <User className={cn(
                    "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors",
                    focusedField === "name" ? "text-blue-500" : "text-gray-400"
                  )} />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField("")}
                    disabled={isLoading}
                    className="pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 text-gray-900"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-900">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className={cn(
                    "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors",
                    focusedField === "email" ? "text-blue-500" : "text-gray-400"
                  )} />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField("")}
                    required
                    disabled={isLoading}
                    className="pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 text-gray-900"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-gray-900">
                  Phone Number
                </Label>
                <div className="relative">
                  <Phone className={cn(
                    "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors",
                    focusedField === "phone" ? "text-blue-500" : "text-gray-400"
                  )} />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+254 7XX XXX XXX"
                    value={formData.phone}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("phone")}
                    onBlur={() => setFocusedField("")}
                    disabled={isLoading}
                    className="pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 text-gray-900"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-900">
                  Password
                </Label>
                <div className="relative">
                  <Lock className={cn(
                    "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors",
                    focusedField === "password" ? "text-blue-500" : "text-gray-400"
                  )} />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField("")}
                    required
                    disabled={isLoading}
                    className="pl-10 pr-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 text-gray-900"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">Password strength</span>
                      <span className={cn("text-xs font-medium", passwordStrength.color)}>
                        {passwordStrength.text}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className={cn(
                          "h-1.5 rounded-full transition-all duration-300",
                          passwordStrength.score <= 2 ? "bg-red-500" :
                          passwordStrength.score <= 3 ? "bg-yellow-500" : "bg-green-500"
                        )}
                        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-900">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className={cn(
                    "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors",
                    focusedField === "confirmPassword" ? "text-blue-500" : "text-gray-400"
                  )} />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("confirmPassword")}
                    onBlur={() => setFocusedField("")}
                    required
                    disabled={isLoading}
                    className={cn(
                      "pl-10 pr-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 text-gray-900",
                      formData.confirmPassword && formData.password !== formData.confirmPassword && "border-red-300"
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <div className="flex items-center text-green-600 text-xs mt-1">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Passwords match
                  </div>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                  disabled={isLoading}
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-gray-900 leading-relaxed cursor-pointer"
                >
                  I agree to the{" "}
                  <Link href="/terms" className="text-blue-600 hover:underline font-medium">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-blue-600 hover:underline font-medium">
                    Privacy Policy
                  </Link>
                </label>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4 pt-6">
              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg"
                disabled={isLoading || !agreeToTerms}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
              
              <div className="text-center">
                <p className="text-sm text-gray-900">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </CardFooter>
          </form>
        </Card>

        
      </div>
    </div>
  );
}
