import fs from "fs";
import matter from "gray-matter";
import path from "path";
import moment from "moment";
import { remark } from "remark";
import html from "remark-html";

import type { ArticleItem } from "@/types";

const articlesDirectory = path.join(process.cwd(), "articles");

const getSortedArticles = (): ArticleItem[] => {
    const fileNames = fs.readdirSync(articlesDirectory);

    const allArticlesData = fileNames.map((fileName) => {
        const id = fileName.replace(/\.md$/, "");
        const fullPath = path.join(articlesDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, "utf-8");
        const matterResult = matter(fileContents);

        return {
            id,
            title: matterResult.data.title,
            date: matterResult.data.date,
            category: matterResult.data.category,
        };
    });

    return allArticlesData.sort((a, b) => {
        const format = "DD-MM-YYYY";
        const dateOne = moment(a.date, format);
        const dateTwo = moment(b.date, format);
        return dateOne.isBefore(dateTwo) ? -1 : dateTwo.isAfter(dateOne) ? 1 : 0;
    });
};

export const getCategorisedArticles = () => {
    const sortedArticles = getSortedArticles();
    const categorizedArticles: { [key: string]: ArticleItem[] } = {};

    sortedArticles.forEach((article) => {
        if (!categorizedArticles[article.category]) {
            categorizedArticles[article.category] = [];
        }
        categorizedArticles[article.category].push(article);
    });

    return categorizedArticles;
};

export const getArticleData = async (slug: string) => {
    const fullPath = path.join(articlesDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, "utf-8");
    const matterResult = matter(fileContents);

    const contentHtml = await remark().use(html).process(matterResult.content);

    return {
        id: slug,
        contentHtml: contentHtml.toString(),
        date: matterResult.data.date,
        title: matterResult.data.title,
        category: matterResult.data.category,
    };
};
