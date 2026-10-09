import React from 'react';
import { useAppSelector } from '../store/hooks';
import type { RootState } from '../store/store';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
    children: React.ReactNode;
}

const privateRoute = ({ children }: PrivateRouteProps) => {
    const user = useAppSelector((state: RootState) => state.auth.user);
    return user ? <>{children}</> : <Navigate to="/login" replace />;
};

export default privateRoute;