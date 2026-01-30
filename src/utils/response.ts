import type { Response } from "express"

export const successResponse = (res: Response, data: any, message: string = "Request Successful") => {
    res.status(200).json({
        success: true,
        status: 'success',
        message,
        data
    })
}

export const errorResponse = (res: Response, message: string, statusCode: number) => {
    res.status(statusCode).json({
        success: false,
        status: 'error',
        message,
        data: null
    })
}