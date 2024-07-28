import api from '@/utils/api';
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, RefreshControl, Spinner } from '@gluestack-ui/themed';
import { useColorScheme } from 'react-native';
import PropertyItem from '@/components/properties_lst/PropertyItem';
import { Property } from '@/types/property';

export default function PropertiesLst({ isMy, filter }: { isMy: boolean, filter: string }) {
	const color = useColorScheme();
	const [data, setData] = useState<Property[]>([]);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(-1);
	const [loading, setLoading] = useState(false);
	const [refreshing, setRefreshing] = useState(false);

	const fetchData = async (pageNum = page, isRefresh = false) => {
		if (loading) return;

		setLoading(true);

		try {
			const res = await api.get(`/api/properties?page=${pageNum}&isMy=${isMy}&filter=${filter}`);
			const result = res.data.properties;

			if (isRefresh) {
				setData(result);
			} else {
				setData(prevData => [...prevData, ...result]);
			}

			setTotalPages(res.data.totalPages);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	};

	const handleRefresh = () => {
		setRefreshing(true);
		setPage(1);
		fetchData(1, true);
	};

	const handleLoadMore = () => {
		if (!loading && !refreshing && page < totalPages) {
			const nextPage = page + 1;
			setPage(nextPage);
			fetchData(nextPage);
		}
	};

	const renderFooter = () => {
		if (!loading) return null;
		return (
			<View padding={20} alignItems='center'>
				<Spinner size="large" />
			</View>
		);
	};

	const listEmptyComponent = () => {
		return (
			<View flex={1} padding={20} alignSelf='center' justifyContent='center'>
				<Text>no properties uploaded</Text>
			</View>
		);
	};

	useEffect(() => {
		fetchData(page, refreshing);
	}, [page]);

	useEffect(() => {
		handleRefresh();
	}, [filter]);

	return (
		<FlatList alignSelf='center'
			ListEmptyComponent={listEmptyComponent}
			data={data}
			contentContainerStyle={{ flexGrow: 1 }}
			keyExtractor={(item, index) => index.toString()}
			renderItem={({ item }) => <PropertyItem data={item as Property} />}
			onEndReached={handleLoadMore}
			onEndReachedThreshold={0.5}


			refreshControl={
				<RefreshControl
					tintColor={color === "light" ? "black" : "white"}
					progressBackgroundColor={color === "light" ? "white" : "#525252"}
					colors={color === "light" ? ["black"] : ["white"]}
					refreshing={refreshing}
					onRefresh={handleRefresh}
				/>
			}
			ListFooterComponent={renderFooter}
		/>
	);
};
