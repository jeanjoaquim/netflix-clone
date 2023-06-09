import { useEffect, useState } from 'react';
import Tmdb from './Tmdb';
import MovieRow from './components/MovieRow';
import FeaturedMovie from './components/FeaturedMovie';
import './styles.css';
import Header from './components/Header';

function App() {

    const [movieList, setMovieList] = useState([]);
    const [featuredData, setFeaturedData] = useState(null);
    const [blackHeader, setBlackHeader] = useState(false);

    useEffect(() => {
        const loadAll = async () => {
            //pegando a lista TOTAL
            let list = await Tmdb.getHomeList();
            setMovieList(list);

            //Pegando o featured
            let originals = list.filter(i => i.slug === 'originals');
            let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length - 1))
            let chosen = originals[0].items.results[randomChosen];
            let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');
            setFeaturedData(chosenInfo);
        }
        loadAll();
    }, [])

    useEffect(() => {
        const scrollListener = () => {
            if(window.scrollY > 10) {
                setBlackHeader(true);
            } else {
                setBlackHeader(false);
            }
        }

        window.addEventListener('scroll', scrollListener);

        return () => {
            window.removeEventListener('scroll', scrollListener)
        }
    })

    return(
        <div className='page'>

            <Header blackHeader={blackHeader} />
            
            {featuredData &&
                <FeaturedMovie item={featuredData} />
            }

            <section className='lists'>
                {movieList.map((item, key) => (
                    <MovieRow key={key} title={item.title} items={item.items} />
                ))}
            </section>

            <footer>
                Feito com <span role='img' aria-label='coração'></span> pela B7Web<br/>
                Direitos de imagem para Netflix<br/>
                Dados pegos do site TheMovieDb.org
            </footer>

            {movieList.length <= 0 && 
                <div className='loading'>
                    <img src='https://www.filmelier.com/pt/br/news/wp-content/uploads/2020/03/netflix-loading.gif' alt='Carregando' />
                </div>
            }

            
        </div>
    );
}

export default App;