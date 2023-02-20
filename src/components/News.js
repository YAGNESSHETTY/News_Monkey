import React, { useEffect, useState } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";


const News = (props)=>{

  const[articles, setArticles] = useState([])
  const[loading, setLoading] = useState(true)
  const[page, setPage] = useState(1)
  const[totalResults, setTotalResults] = useState(0)
  
  

    const capitalFirstLetter=(string)=>{
      return string.charAt(0).toUpperCase()+string.slice(1);
    }

    // this is to remove al the extra lines of code from next prev and mount functions 
    const updateNews=async ()=>{
        props.setProgress(10);
      // console.log("componentDidMount");
        const url=`https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pagesize=${props.pageSize}`;
        
        setLoading(true);
        let data=await fetch(url);
        props.setProgress(30);
        let parsedData= await data.json();
        props.setProgress(60);
        console.log(parsedData);
        setArticles(parsedData.articles);
        setTotalResults(parsedData.totalResults);
        setLoading(false);
        props.setProgress(100);
    }



    // to fetch data from news api 
    // and yen render ka baad run hoga 
    // async and await yha pr promise return hone ka intazzar krenge 
    // async componentDidMount(){
    //     this.updateNews();
    // }
    // hooks ka use componentDidMount ki jgh 
    useEffect(()=>{
      document.title=`NewsMonkey - ${capitalFirstLetter(props.category)}`;
      updateNews();
    }, [])

    const fetchMoreData = async () => {
      
      const url=`https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page+1}&pagesize=${props.pageSize}`;
      setPage(page+1);
        
        let data=await fetch(url);
        let parsedData= await data.json();
        console.log(parsedData);
        setArticles(articles.concat(parsedData.articles));
        setTotalResults(parsedData.totalResults);
        
    };


    // // functions to handle clicks
    // handleNextClick = async ()=>{
    // this.setState({page: page + 1});
    // this.updateNews();

    // } 
    // handlePrevClick=async()=>{
    //   this.setState({page: page - 1});
    //   this.updateNews();
    // }

    return (
      <>
        <h1 className="text-center" style={{margin: '35px 0px' , marginTop: '90px'}}>NewMonkey - Top {capitalFirstLetter(props.category)} Headlines</h1>
        {loading && <Spinner/>}
        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length!== totalResults}
          loader={<Spinner/>}
        >
          <div className="container">

          
        <div className="row">
        {articles.map((element)=>{
            // console.log(element);
            return <div className="col-md-4"  key={element.url}>
            <NewsItem title={element.title?element.title:""} description={element.description?element.description:""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name}/>
            </div>
        })}
        </div>
        </div>
        </InfiniteScroll>
        {/* <div className="container d-flex justify-content-between">
        <button disabled={page<=1} type="button" className="btn btn-dark" onClick={this.handlePrevClick}>&larr; Previous</button>
        <button disabled={page +1 >Math.ceil(totalArticles/props.pageSize)} type="button" className="btn btn-dark" onClick={this.handleNextClick}>Next&rarr;</button>
        </div> */}
        
      </>
    );
  
}

News.defaultProps={
  country: 'in',
  pageSize:8,
  category:'general'
}

News.propTypes={
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string
}

export default News;
