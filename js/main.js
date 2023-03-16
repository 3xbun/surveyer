const { createApp, ref, computed } = Vue;

createApp({
  setup() {
    const data = ref([]);
    const name = ref("");
    const page = ref("login");

    const username = ref("");
    const password = ref("");
    const BASE_URL = "";
    const users = ref([]);
    const user = ref({});

    const reset = () => {
      username.value = "";
      name.value = "";
      user.value = {};
      data.value = [];
    };

    const summary = computed(() => {
      sumQ1 =
        data.value.reduce((acc, e) => {
          return parseInt(acc) + parseInt(e.q1);
        }, 0) / data.value.length;

      sumQ2 =
        data.value.reduce((acc, e) => {
          return parseInt(acc) + parseInt(e.q2);
        }, 0) / data.value.length;

      sumQ3 =
        data.value.reduce((acc, e) => {
          return parseInt(acc) + parseInt(e.q3);
        }, 0) / data.value.length;

      sumQ4 =
        data.value.reduce((acc, e) => {
          return parseInt(acc) + parseInt(e.q4);
        }, 0) / data.value.length;

      sumQ5 =
        data.value.reduce((acc, e) => {
          return parseInt(acc) + parseInt(e.q5);
        }, 0) / data.value.length;

      sumQ6 =
        data.value.reduce((acc, e) => {
          return parseInt(acc) + parseInt(e.q6);
        }, 0) / data.value.length;

      sumQ7 =
        data.value.reduce((acc, e) => {
          return parseInt(acc) + parseInt(e.q7);
        }, 0) / data.value.length;

      return {
        q1: parseFloat(sumQ1).toFixed(1),
        q2: parseFloat(sumQ2).toFixed(1),
        q3: parseFloat(sumQ3).toFixed(1),
        q4: parseFloat(sumQ4).toFixed(1),
        q5: parseFloat(sumQ5).toFixed(1),
        q6: parseFloat(sumQ6).toFixed(1),
        q7: parseFloat(sumQ7).toFixed(1),
      };
    });

    const getData = async () => {
      axios
        .get(BASE_URL + "/data/survey.json")
        .then((res) => {
          data.value = res.data
            .filter((e) => {
              const filter = e.teacherID.includes(username.value);
              return filter;
            })
            .sort(
              (a, b) =>
                cmp(a.subject, b.subject) ||
                cmp(a.class, b.class) ||
                cmp(a.room, b.room)
            );
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
        return (
          e.username.startsWith(username.value.toLowerCase()) &&
          e.username != "materdei"
        );
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

      if (password.value === (await user.value.password)) {
        document.body.style.backgroundColor = "#ebebeb";
        if (username.value === "materdei") {
          page.value = "admin";
          reset();
        } else {
          await getData();
          page.value = await "home";
        }
      } else {
        alert("Wrong password");
      }
    };

    const cmp = (a, b) => (a > b) - (a < b);

    return {
      data,
      name,
      filteredUser,
      page,
      username,
      user,
      users,
      password,
      summary,
      getData,
      login,
      search,
      showUser,
      reset,
    };
  },
}).mount("#app");
