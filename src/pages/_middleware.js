import { NextResponse } from 'next/server'
export async function middleware(req, ev) {
    const { pathname, query, params } = req.nextUrl
    if (pathname == '/') {
        return NextResponse.redirect('/elections')
    }
    return NextResponse.next()
}