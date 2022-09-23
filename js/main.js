const { createApp, ref, computed } = Vue;

createApp({
  setup() {
    const data = ref([]);
    const name = ref("");
    const page = ref("login");

    const username = ref("bunnasorn.k");
    const password = ref("EC671R");
    const BASE_URL = "/surveyer";
    const user = ref({});

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

    const login = async () => {
      const userData = await axios.get(BASE_URL + "/data/Teachers.json");
      console.log(username.value);
      user.value = await userData.data.filter(
        (e) => e.username === username.value
      )[0];

      console.log(password.value === user.value.password);

      if (password.value === (await user.value.password)) {
        page.value = "home";
        getData();
      } else {
        alert("Wrong password");
      }
    };

    const filteredData = computed(() => {
      const d = data.value;
      return d
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
      filteredData,
      page,
      username,
      user,
      password,
      getData,
      login,
    };
  },
}).mount("#app");
