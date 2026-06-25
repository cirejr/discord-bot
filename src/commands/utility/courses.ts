import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

const coursesCommand = {
  data: new SlashCommandBuilder()
    .setName("e-learning-courses")
    .setDescription("List the courses of the e-learning platform"),
  async execute(interaction: ChatInputCommandInteraction) {
    const res = await fetch("https://e-learning-3esf.onrender.com/api/courses");
    if (!res.ok) throw new Error("Failed to fetch courses");

    const courses = await res.json();
    const formattedCourses = courses.data
      .map((course: any) => {
        const teacherName = `${course.teacher_first_name} ${course.teacher_last_name}`;
        return `**📚 ${course.title}**\n📝 ${course.description}\n👨‍🏫 Teacher: ${teacherName}\n🗓️ ${course.start_date} to ${course.end_date}\n`;
      })
      .join("\n"); // Joins the array items cleanly with a new line

    await interaction.reply(
      `Here are the courses:\n\n${formattedCourses.slice(0, 1900)}`,
    );
  },
};

export default coursesCommand;
