import ArticleItemList from "@/components/ArticleListItem";
import { getCategorisedArticles } from "@/lib/articles";

const HomePage = () => {
  const articles = getCategorisedArticles();

  console.log(articles);
  return (
    <section className="mx-auto w-11/12 md:w-4/5 mt-20 flex flex-col gap-16 mb-20">
      <header className="font-cormorantGaramond font-light text-6xl text-neutral-900 text-center">
        <h1>Patrick&apos;s Blog</h1> {/* Escaped apostrophe */}
      </header>
      <section className="md:grid md:grid-cols-2 gap-10">
        {articles !== null &&
          Object.keys(articles).map((article) => (
            <div
              key={article}
              className="bg-white rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105 hover:shadow-xl"
            >
              <ArticleItemList
                category={article}
                articles={articles[article]}
              />
            </div>
          ))}
      </section>
    </section>
  );
};

export default HomePage;
