"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";

interface FormData {
  reportingCriteria: "audience" | "stakeholder";
  name: string;
  email?: string;
  complaintCategory: string;
  complaintRelated: string;
  rating: number;
  reviewDescription?: string;
  verificationEvidence?: FileList;
}

const complaintCategories = [
  { id: "service", label: "Service Quality", icon: "🔧" },
  { id: "product", label: "Product Issues", icon: "📦" },
  { id: "billing", label: "Billing Problems", icon: "💳" },
  { id: "staff", label: "Staff Behavior", icon: "👥" },
  { id: "facility", label: "Facility Issues", icon: "🏢" },
  { id: "other", label: "Other", icon: "❓" }
];

const complaintRelated = [
  { id: "very-satisfied", label: "Very Satisfied", emoji: "😊" },
  { id: "satisfied", label: "Satisfied", emoji: "🙂" },
  { id: "neutral", label: "Neutral", emoji: "😐" },
  { id: "dissatisfied", label: "Dissatisfied", emoji: "😞" },
  { id: "very-dissatisfied", label: "Very Dissatisfied", emoji: "😡" }
];

export default function CustomerReviewForm() {
  const [rating, setRating] = useState([5]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      rating: 5
    }
  });

  const watchedFields = watch();

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Here you would typically send the data to your API
      console.log("Form submitted:", { ...data, rating: rating[0] });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert("Review submitted successfully!");
    } catch (error) {
      alert("Error submitting review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingColor = (value: number) => {
    if (value <= 3) return "bg-red-500";
    if (value <= 6) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getRatingLabel = (value: number) => {
    if (value <= 3) return "Detractor";
    if (value <= 6) return "Passive";
    return "Promoter";
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Customer Review Form</CardTitle>
          <CardDescription className="text-center">
            We value your feedback. Please share your experience with us.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Reporting Criteria */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">
                Reporting Criteria <span className="text-red-500">*</span>
              </Label>
              <RadioGroup
                value={watchedFields.reportingCriteria}
                onValueChange={(value) => setValue("reportingCriteria", value as "audience" | "stakeholder")}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="audience" id="audience" />
                  <Label htmlFor="audience">Audience</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="stakeholder" id="stakeholder" />
                  <Label htmlFor="stakeholder">Stakeholder</Label>
                </div>
              </RadioGroup>
              {errors.reportingCriteria && (
                <p className="text-red-500 text-sm">Please select a reporting criteria</p>
              )}
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base font-semibold">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base font-semibold">
                Email Address <span className="text-gray-500">(Optional)</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                {...register("email", {
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Complaint Category */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">
                Complaint Category <span className="text-red-500">*</span>
              </Label>
              <RadioGroup
                value={watchedFields.complaintCategory}
                onValueChange={(value) => setValue("complaintCategory", value)}
                className="grid grid-cols-2 gap-4"
              >
                {complaintCategories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value={category.id} id={category.id} />
                    <Label htmlFor={category.id} className="flex items-center gap-2 cursor-pointer">
                      <span className="text-lg">{category.icon}</span>
                      <span>{category.label}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              {errors.complaintCategory && (
                <p className="text-red-500 text-sm">Please select a complaint category</p>
              )}
            </div>

            {/* Complaint Related */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">
                Overall Satisfaction <span className="text-red-500">*</span>
              </Label>
              <RadioGroup
                value={watchedFields.complaintRelated}
                onValueChange={(value) => setValue("complaintRelated", value)}
                className="grid grid-cols-1 gap-3"
              >
                {complaintRelated.map((item) => (
                  <div key={item.id} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value={item.id} id={item.id} />
                    <Label htmlFor={item.id} className="flex items-center gap-3 cursor-pointer">
                      <span className="text-2xl">{item.emoji}</span>
                      <span>{item.label}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              {errors.complaintRelated && (
                <p className="text-red-500 text-sm">Please select your satisfaction level</p>
              )}
            </div>

            {/* NPS Rating */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">
                NPS Rating (0-10) <span className="text-red-500">*</span>
              </Label>
              <div className="space-y-4">
                <div className="px-4">
                  <Slider
                    value={rating}
                    onValueChange={setRating}
                    max={10}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>0 - Not likely</span>
                  <span>10 - Extremely likely</span>
                </div>
                <div className="text-center">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-white text-sm font-medium ${getRatingColor(rating[0])}`}>
                    Score: {rating[0]} - {getRatingLabel(rating[0])}
                  </div>
                </div>
              </div>
            </div>

            {/* Review Description */}
            <div className="space-y-2">
              <Label htmlFor="reviewDescription" className="text-base font-semibold">
                Review / Complaint Description <span className="text-gray-500">(Optional)</span>
              </Label>
              <Textarea
                id="reviewDescription"
                placeholder="Please describe your experience in detail..."
                rows={4}
                maxLength={1000}
                {...register("reviewDescription", {
                  maxLength: {
                    value: 1000,
                    message: "Description must be less than 1000 characters"
                  }
                })}
              />
              <div className="text-right text-sm text-gray-500">
                {watchedFields.reviewDescription?.length || 0}/1000 characters
              </div>
              {errors.reviewDescription && (
                <p className="text-red-500 text-sm">{errors.reviewDescription.message}</p>
              )}
            </div>

            {/* Verification Evidence */}
            <div className="space-y-2">
              <Label htmlFor="verificationEvidence" className="text-base font-semibold">
                Verification Evidence <span className="text-gray-500">(Optional)</span>
              </Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <Input
                  id="verificationEvidence"
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  className="hidden"
                  {...register("verificationEvidence")}
                />
                <Label htmlFor="verificationEvidence" className="cursor-pointer">
                  <div className="space-y-2">
                    <div className="text-4xl">📎</div>
                    <div className="text-sm text-gray-600">
                      Click to upload files or drag and drop
                    </div>
                    <div className="text-xs text-gray-500">
                      Supports: Images, PDF, DOC, DOCX (Max 5MB each)
                    </div>
                  </div>
                </Label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
