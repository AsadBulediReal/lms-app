"use client";

import { Button } from "@/components/ui/button";
import { formatprice } from "@/lib/format";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

interface CourseEnrollButtonProps {
  courseId: string;
  price: number;
}

const CourseEnrollButton = ({ courseId, price }: CourseEnrollButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);

      const response = await axios.post(`/api/courses/${courseId}/checkout`);
      window.location.assign(response.data.url);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Button
      className="w-full md:w-auto"
      size={"lg"}
      onClick={onClick}
      disabled={isLoading}
    >
      {price === 0 || price === null
        ? "Enroll For FREE"
        : `Enroll For ${formatprice(price)}`}
    </Button>
  );
};

export default CourseEnrollButton;
