const { createApp, ref, computed } = Vue;

createApp({
  setup() {
    const data = ref([]);
    const name = ref("");
    const page = ref("login");

    const username = ref("");
    const password = ref("");
    const BASE_URL = "/surveyer";
    const users = ref([]);
    const user = ref({});

    const reset = () => {
      username.value = "";
      name.value = "";
      user.value = {};
      data.value = [];
    };

    const getData = async () => {
      axios
        .get(BASE_URL + "/data/survey.json")
        .then((res) => {
          data.value = res.data;
        })
        .catch((err) => {
          console.error(err);
        });
    };

    const search = async () => {
      const u = await axios.get(BASE_URL + "/data/Teachers.json");
      users.value = await u.data;
    };

    const filteredUser = computed(() => {
      const u = users.value;
      return u.filter((e) => {
        return e.username.startsWith(username.value);
      });
    });

    const showUser = (u) => {
      username.value = u.username;
      user.value = u;
      getData();
    };

    const login = async () => {
      const userData = await axios.get(BASE_URL + "/data/Teachers.json");
      user.value = await userData.data.filter(
        (e) => e.username === username.value
      )[0];

      console.log(user.value.password);
      if (password.value === (await user.value.password)) {
        if (username.value === "materdei") {
          page.value = "admin";
          reset();
        } else {
          page.value = "home";
          getData();
        }
      } else {
        alert("Wrong password");
      }
    };

    const filteredData = computed(() => {
      return data.value
        .filter((e) => {
          const i = e.teachers.split(",");
          const filter = i.includes(username.value);
          return filter;
        })
        .sort(
          (a, b) =>
            cmp(a.subject, b.subject) ||
            cmp(a.class, b.class) ||
            cmp(a.room, b.room)
        );
    });

    const cmp = (a, b) => (a > b) - (a < b);

    return {
      data,
      name,
      filteredUser,
      filteredData,
      page,
      username,
      user,
      users,
      password,
      getData,
      login,
      search,
      showUser,
      reset,
    };
  },
}).mount("#app");
