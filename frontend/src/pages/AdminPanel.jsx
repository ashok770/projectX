// A simple Admin UI where Faculty can enter the code shown by the student
const handleHandover = async () => {
  const res = await axios.post("/api/admin/complete-handover", { code });
  if (res.data.success) {
    alert("Item handed over! Transaction logged.");
  }
};
