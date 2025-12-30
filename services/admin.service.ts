import api from "@/api/axios";

const adminService = {
  getMe: async () => {
    const { data } = await api.get("/user/me");
    return data.data;
  },
};

export default adminService;
