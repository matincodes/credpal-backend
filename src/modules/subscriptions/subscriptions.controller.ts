import type { Request, Response, NextFunction } from 'express';
import * as subService from './subscriptions.service.js';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sub = await subService.createSubscription(req.user!._id.toString(), req.body);
    res.status(201).json({ success: true, data: { subscription: sub } });
  } catch (err) { next(err); }
};

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subs = await subService.getAllSubscriptions(req.user!._id.toString());
    res.status(200).json({ success: true, results: subs.length, data: { subscriptions: subs } });
  } catch (err) { next(err); }
};

export const getOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sub = await subService.getSubscriptionById(req.user!._id.toString(), req.params.id as string);
    res.status(200).json({ success: true, data: { subscription: sub } });
  } catch (err) { next(err); }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sub = await subService.updateSubscription(req.user!._id.toString(), req.params.id as string, req.body);
    res.status(200).json({ success: true, data: { subscription: sub } });
  } catch (err) { next(err); }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await subService.deleteSubscription(req.user!._id.toString(), req.params.id as string);
    res.status(200).json({ success: true, message: 'Subscription deleted' });
  } catch (err) { next(err); }
};

export const cancel = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sub = await subService.cancelSubscription(req.user!._id.toString(), req.params.id as string);
    res.status(200).json({ success: true, message: 'Subscription cancelled', data: { subscription: sub } });
  } catch (err) { next(err); }
};

export const getUpcoming = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subs = await subService.getUpcomingRenewals(req.user!._id.toString());
    res.status(200).json({ success: true, results: subs.length, data: { upcoming: subs } });
  } catch (err) { next(err); }
};