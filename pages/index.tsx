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
    <div className=''>
      <Header />

      <main className='flex flex-col gap-3 px-80 py-5'>
        {
          posts.map(post => {
            return <PostCard post={ post } />
          }) 
        }
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
