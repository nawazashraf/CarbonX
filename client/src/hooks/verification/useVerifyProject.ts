import { useMutation } from "@tanstack/react-query";
import { verifyProject } from "@/api/verification";

export const useVerifyProject = () => {
  return useMutation({
    mutationFn: verifyProject,
  });
};
