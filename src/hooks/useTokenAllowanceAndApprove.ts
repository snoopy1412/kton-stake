import { useCallback, useEffect, useRef } from 'react';
import { useReadContract, useWriteContract } from 'wagmi';
import { erc20Abi, parseEther } from 'viem';
import { toast } from 'sonner';
import { useApp } from './useApp';

interface UseTokenAllowanceAndApproveProps {
  tokenAddress: `0x${string}`; // 代币合约地址
  ownerAddress: `0x${string}`; // 拥有者地址
  spenderAddress: `0x${string}`; // 被授权者地址
}

export function useTokenAllowanceAndApprove({
  tokenAddress,
  ownerAddress,
  spenderAddress
}: UseTokenAllowanceAndApproveProps) {
  const toastRef = useRef<string | number | null>(null);
  const { activeChainId } = useApp();

  const { data: allowance, isLoading: isAllowanceLoading } = useReadContract({
    chainId: activeChainId,
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [ownerAddress, spenderAddress]
  });

  const { writeContract, isPending, isError, isSuccess, failureReason, data } = useWriteContract();

  const approve = useCallback(
    (amount: string): void => {
      writeContract({
        chainId: activeChainId,
        abi: erc20Abi,
        address: tokenAddress,
        functionName: 'approve',
        args: [spenderAddress, parseEther(amount)]
      });
    },
    [tokenAddress, activeChainId, spenderAddress, writeContract]
  );

  useEffect(() => {
    if (isError) {
      toastRef.current = toast(failureReason?.message || 'Approve failed', {
        duration: 5000,
        classNames: {
          toast: 'group-[.toaster]:border-red-500',
          closeButton: 'group-[.toast]:bg-red-500 group-[.toast]:border-red-500'
        }
      });
    }
    if (isSuccess) {
      if (toastRef.current) {
        toast.dismiss(toastRef.current);
      }
    }
    return () => {
      if (toastRef.current) {
        toast.dismiss(toastRef.current);
      }
    };
  }, [isError, isSuccess, failureReason]);

  return {
    isAllowanceLoading,
    allowance,
    approve,
    isApproving: isPending,
    approveData: data,
    isApproveSuccess: isSuccess,
    isApproveError: isError,
    approveFailureReason: failureReason
  };
}