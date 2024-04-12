class ApiService {
  async getRepos() {
    const res = await fetch("https://api.github.com/users/nosycolg/repos", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return await res.json();
  }
}

export const GithubAPI = new ApiService();
