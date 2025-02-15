"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { oboardingSchema } from "@/app/lib/schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/use-fetch";
import { updateUser } from "@/actions/user";
import { toast } from "sonner";
import { Loader } from "lucide-react";

const OnboardingForm = ({ industries }) => {
  const [selectedIndustry, setSelectedIndustry] = useState(null);

  const router = useRouter();

  const {
    loading: updateLoading,
    fn: updateUserfn,
    data: updateResult,
  } = useFetch(updateUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(oboardingSchema),
  });
  const onSubmit = async (values) => {
    try {
      const formattedIndustry = `${values.industry}-${values.subIndustry
        .toLowerCase()
        .replace(/ /g, "-")}`;

      await updateUserfn({
        ...values,
        industry: formattedIndustry,
      });
    } catch (error) {
      console.log("onBoarding error: ", error);
    }
  };

  useEffect(() => {
    if (updateResult?.success && !updateLoading) {
      toast.success("Profile completed successfully");
      router.refresh();
    }
  }, [updateResult, updateLoading]);

  const watchIndustry = watch("industry");
  return (
    <div className="flex items-center justify-center bg-background">
      <Card className="w-full max-w-lg mt-10 mx-2">
        <CardHeader>
          <CardTitle className="gradient-title text-4xl">
            Complete Your Profile :
          </CardTitle>
          <CardDescription>
            Select yput industry to get a personalized career insights and
            recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action=""
            className="space-y-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* INDUSTRY  */}
            <div className="space-y-2">
              <Label htmlFor="Industry" className="">
                Industry :
              </Label>

              <Select
                onValueChange={(value) => {
                  setValue("industry", value);
                  setSelectedIndustry(
                    industries.find((ind) => ind.id === value)
                  );
                  setValue("subIndustry", "");
                }}
              >
                <SelectTrigger className="w-[180px]" id="industry">
                  <SelectValue placeholder="Select an Industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((ind) => {
                    return (
                      <SelectItem value={ind.id} key={ind.id}>
                        {ind.name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {errors.industry && (
                <p className="text-sm text-red-500">
                  {errors.industry.message}
                </p>
              )}
            </div>

            {/* INDUSTRY SPECIALIZATION  */}

            {watchIndustry && (
              <div className="space-y-2">
                <Label htmlFor="Industry" className="">
                  Specialization :
                </Label>

                <Select
                  onValueChange={(value) => setValue("subIndustry", value)}
                >
                  <SelectTrigger className="w-[180px]" id="subIndustry">
                    <SelectValue placeholder="Select an Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedIndustry?.subIndustries.map((ind) => {
                      return (
                        <SelectItem value={ind} key={ind}>
                          {ind}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                {errors.industry && (
                  <p className="text-sm text-red-500">
                    {errors.subIndustry.message}
                  </p>
                )}
              </div>
            )}

            {/* YEARS OF EXPERIENCE */}

            <div className="space-y-2">
              <Label htmlFor="Industry" className="">
                Years Of Experience :
              </Label>

              <Input
                id="experience"
                type="number"
                min="0"
                max="50"
                {...register("experience")}
              ></Input>

              {errors.experience && (
                <p className="text-sm text-red-500">
                  {errors.experience.message}
                </p>
              )}
            </div>

            {/* SKILLS */}

            <div className="space-y-2">
              <Label htmlFor="skills" className="">
                Skills
              </Label>

              <Input
                id="skills"
                placeholder="eg. c++, Javascript, python"
                {...register("skills")}
              ></Input>

              <p className="text-sm text-muted-foreground">
                !! Separate multiple skills with commas !!
              </p>

              {errors.skills && (
                <p className="text-sm text-red-500">{errors.skills.message}</p>
              )}
            </div>

            {/* BIO */}
            <div className="space-y-2">
              <Label htmlFor="bio" className="">
                Professional Bio
              </Label>

              <Textarea
                id="bio"
                placeholder="Tell us about professional background...  "
                className="h-32"
                {...register("bio")}
              ></Textarea>

              {errors.bio && (
                <p className="text-sm text-red-500">{errors.bio.message}</p>
              )}
            </div>
            <Button className="w-full" type="submit" disabled={updateLoading}>
              {updateLoading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" /> Saving
                </>
              ) : (
                " Complete Profile"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingForm;
