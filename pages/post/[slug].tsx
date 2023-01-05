import fs from 'fs'
import fm from 'front-matter'
import { marked } from 'marked'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import Header from '../../components/Header'
import Link from 'next/link'
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

            <div className='px-80 py-5 markdown-body' dangerouslySetInnerHTML={ {__html: content } }>
            </div>
            <div className='px-80' >
                <Link href="/" legacyBehavior>
                    <a href="/">Back to Home</a>
                </Link>
            </div>

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