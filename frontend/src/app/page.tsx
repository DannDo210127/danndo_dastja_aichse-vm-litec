'use client'
import api from "@/api/client";

import { useQuery } from "@tanstack/react-query";

const IndexPage = () => {
  const user = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await api.get("/user");
      return data;
    },
  });

  return (
    <div>index page</div>
  )
};

export default IndexPage;