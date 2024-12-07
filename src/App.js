import React, { useState, useEffect } from "react";
import alanBtn from '@alan-ai/alan-sdk-web';
import NewsCards from "./components/NewsCards/NewsCards";
import useStyles from './styles';
import wordsToNumbers from 'words-to-numbers';

const alanKey = '237f21a73d083ac118fb943d234fae5b2e956eca572e1d8b807a3e2338fdd0dc/stage';

const App = () => {
    const [activeArticle, setActiveArticle] = useState(0);
    const [newsArticles, setNewsArticles] = useState([]);

    const classes = useStyles();

    useEffect(() => {
        alanBtn({
            key: alanKey,
            onCommand: ({ command, articles, number }) => {
                if (command === 'newHeadlines') {
                    setNewsArticles(articles);
                    setActiveArticle(-1);
                }
                else if (command === 'highlight') {
                    setActiveArticle((prevActiveArticle) => prevActiveArticle + 1);
                }
                else if (command === 'open') {
                    const parsedNumber = number.length > 2 ? wordsToNumbers((number), { fuzzy: true }) : number;
                    const article = articles[parsedNumber - 1];

                    if (parsedNumber > articles.length) {
                        alanBtn().playText('Please try that again...');
                    } else if (article) {
                        window.open(article.url, '_blank');
                        alanBtn().playText('Opening...');
                    }
                    // else {
                    //         alanBtn().playText('Please try that again...');
                    //     }
                }
            },
        })
    }, [])
    return (
        <div>
            <div className={classes.logoContainer}>
                <img src="https://cdn.pixabay.com/photo/2016/03/31/20/51/book-1296045_960_720.png" className={classes.alanLogo} alt="logo" />
            </div>
            <NewsCards articles={newsArticles} activeArticle={activeArticle} />
        </div>
    );
}

export default App;