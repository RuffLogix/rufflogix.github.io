import fs from 'fs'
import fm from 'front-matter'
// import { marked } from 'marked'
import md from 'markdown-it'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import "../../node_modules/github-markdown-css/github-markdown-light.css"
import Head from 'next/head'
import prism from 'markdown-it-prism'

// import "../../node_modules/prismjs/components/prism-clike"
// import "prismjs/components/prism-clike"

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
            <Head>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.5.1/katex.min.css" />
            </Head>
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
    let paths: IPath[] = []

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
    const mdk = require('markdown-it-katex')

    const slug: string | undefined | string[] = context.params?.slug

    let content: string = fs.readFileSync('./posts/' + slug + '.md' , 'utf-8')

    let marked = md()
    marked.use(mdk, {"throwOnError" : false, "errorColor" : " #cc0000"})
    marked.use(prism)

    content = fm(content).body
    // content = marked.parse(content)
    content = marked.render(content)

    return {
        props: {
            content
        }
    }
}

export default Blog