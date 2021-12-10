import { NextResponse, NextRequest } from 'next/server'
export async function middleware(req, ev) {
    const { pathname, query, params } = req.nextUrl
    if (pathname == '/') {
        return NextResponse.redirect('/elections?page=1')
    }
    return NextResponse.next()
}