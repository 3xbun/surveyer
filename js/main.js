const { createApp, ref, computed } = Vue;

createApp({
  setup() {
    // A "ref" is a reactive data source that stores a value.
    // Technically, we don't need to wrap the string with ref()
    // in order to display it, but we will see in the next
    // example why it is needed if we ever intend to change
    // the value.
    const data = ref([]);
    const name = ref("");
    const page = ref("login");

    const getData = () => {
      axios
        .get("../survey.json")
        .then((res) => {
          data.value = res.data;
        })
        .catch((err) => {
          console.error(err);
        });
    };

    const login = () => {
      page.value = "home";
      name.value = "ครูบรรณสรณ์";
      getData();
    };

    const filteredData = computed(() => {
      const d = data.value;
      return d.filter((e) => {
        return e.teacher.startsWith(name.value);
      });
    });

    return {
      data,
      name,
      filteredData,
      page,
      getData,
      login,
    };
  },
}).mount("#app");
