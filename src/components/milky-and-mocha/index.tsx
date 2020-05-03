import axios from 'axios';
import { createUseStyles } from 'react-jss';
import React, { useState } from 'react';
import style from './milky-and-mocha-style';
import InfiniteScroll from 'react-infinite-scroller';
import loader from '../../images/loader.gif';

const useStyles = createUseStyles(style);
const LIMIT = 50;
let offset = 0;

function MilkyAndMocha() {
  const [gifDetails, setGifDetails] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const { container, details, wrapper, loaderWrapper, loaderImg } = useStyles();

  async function getGifDetails() {
    try {
      const {
        data: { results = [] },
      } = await axios.get('https://api.tenor.com/v1/search', {
        params: {
          q: 'milky and mocha',
          key: process.env.REACT_APP_TENOR_TOKEN,
          limit: LIMIT,
          pos: offset,
        },
      });

      if (results.length < LIMIT) {
        setHasMore(false);
      }

      offset = offset + LIMIT;

      const resultData = [...gifDetails, ...results];
      setGifDetails(resultData);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <section className={container}>
      <InfiniteScroll
        className={details}
        pageStart={0}
        loadMore={getGifDetails}
        hasMore={hasMore}
        loader={
          <div className={loaderWrapper} key={0}>
            <img className={loaderImg} src={loader} alt='Loading...' />
          </div>
        }
      >
        {gifDetails.map(function (gif: any) {
          return (
            <div key={gif.id.toString()} className={wrapper}>
              <GifImg gifObj={gif} />
            </div>
          );
        })}
      </InfiniteScroll>
    </section>
  );
}

function GifImg({ gifObj }: any) {
  const { img } = useStyles();
  const [showGif, setShowGif] = useState(false);

  return (
    <img
      className={img}
      onMouseEnter={() => setShowGif(true)}
      onMouseLeave={() => setShowGif(false)}
      src={
        showGif
          ? gifObj?.media[0]?.gif?.url
          : gifObj?.media[0]?.mediumgif?.preview
      }
      alt='Milky and Mocha'
    />
  );
}

export default MilkyAndMocha;
