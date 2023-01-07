import fs from 'fs'
import fm from 'front-matter'
import { marked } from 'marked'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import "../../node_modules/github-markdown-css/github-markdown-light.css"

interface Props {
    content: string,
}

interface IPath {
    params: {
        slug: string
    }
}

const Blog: NextPage<Props> = ({ content }) => {
    return (
        <div>
            <Header />
            <img 
                src="https://images.unsplash.com/photo-1593062096033-9a26b09da705?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80" 
                className='object-cover h-64 w-full'
                alt="banner" 
            />
            <div className='px-80 py-5 markdown-body' dangerouslySetInnerHTML={ {__html: content } }></div>
            <Footer />
        </div>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    const filename: string[] = fs.readdirSync('./posts')
    let paths: IPath[] = [];

    filename.forEach(fn => {
        paths.push({
            params: {
                slug: fn.replace('.md', '')
            }
        })
    })

    return {
        paths,
        fallback: false,
    }
}

export const getStaticProps: GetStaticProps<Props> = async (context) => {    
    const slug: string | undefined | string[] = context.params?.slug

    let content: string = fs.readFileSync('./posts/' + slug + '.md' , 'utf-8')
    content = fm(content).body
    content = marked.parse(content)

    return {
        props: {
            content
        }
    }
}

export default Blog