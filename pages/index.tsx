import type { GetStaticProps, NextPage } from 'next'
import { IPost } from '../interfaces/IPost';
import Header from '../components/Header';
import gmt from 'gray-matter';
import fs from 'fs'
import PostCard from '../components/PostCard';
import Footer from '../components/Footer';

interface Props {
  posts: IPost[],
}
const Home: NextPage<Props> = ({ posts }) => {
  return (
    <div className='relative'>
      <Header />
    
      <img 
        src="https://images.unsplash.com/photo-1593062096033-9a26b09da705?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80" 
        className='object-cover h-64 w-full'
        alt="banner" 
      />
    
      <div className='flex px-80 py-3 justify-center'>
        <h1 className='text-4xl underline'>
          Blog
        </h1>
      </div>

      <main className='flex flex-col gap-5 px-80 pb-5'>
        {
          posts.map((post, idx) => {
            return <PostCard post={ post } key={ idx } />
          }) 
        }

        {/* <div dangerouslySetInnerHTML={ { __html: katex.renderToString('\\ce{CO2 + C -> 2 C0}') } }></div> */}
      </main>

      <Footer />
    </div>
  )
}

const month2num = (month: string): number => {
  if(month == 'Jan') return 0;
  else if(month == 'Feb') return 1;
  else if(month == 'Mar') return 2;
  else if(month == 'Apr') return 3;
  else if(month == 'May') return 4;
  else if(month == 'Jun') return 5;
  else if(month == 'Jul') return 6;
  else if(month == 'Aug') return 7;
  else if(month == 'Sep') return 8;
  else if(month == 'Oct') return 9;
  else if(month == 'Nov') return 10;
  else if(month == 'Dec') return 11;

  return 0
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const filename = fs.readdirSync('./posts')
  let posts: IPost[] = []

  filename.forEach(fn => {
    const content = gmt(fs.readFileSync('./posts/'+fn, { encoding: 'utf-8', flag: 'r' })).data
    const { title, tags, author, date } = content
    
    posts.push({
      title,
      tags,
      author,
      date,
      slug: fn.replace('.md', ''),
    })
  })

  posts = posts.sort((a: IPost, b: IPost) => {
    let a_data = a.date.split(' ')
    let a_day = a_data[0], a_month = a_data[1], a_year = a_data[2]
    let b_data = b.date.split(' ')
    let b_day = b_data[0], b_month = b_data[1], b_year = b_data[2]

    if(a_year != b_year) return a_year > b_year ? -1 : 1;
    if(month2num(a_month) != month2num(b_month)) return month2num(a_month) > month2num(b_month) ? -1 : 1;
    return a_day > b_day ? -1 : 1; 
  })

  return {
    props: {
      posts,
    }
  }
}

export default Home
