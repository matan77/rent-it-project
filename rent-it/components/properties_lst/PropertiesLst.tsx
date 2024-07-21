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


	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		if (loading) return;

		setLoading(true);



		try {

			const res = await api.get(`/api/properties?page=${page}&isMy=${isMy}&filter=${filter}`);
			const result = res.data.properties;
			setTotalPages(res.data.totalPages);


			setData(prevData => [...prevData, ...result]);
			if (page < totalPages) {
				setPage(page + 1);
			}

		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	};

	const handleRefresh = () => {
		setPage(1);
		fetchData();
	};

	const handleLoadMore = () => {
		if (!loading && page <= totalPages) {
			fetchData();
		}
	};

	const renderFooter = () => {
		if (!loading) return null;
		return (
			<View padding={20} alignItems='center'>
				<Spinner size="large" color={color === "light" ? "black" : "white"} />
			</View>
		);
	};


	const listEmptyComponent = () => {
		return (
			<View flex={1}  padding={20} alignSelf='center' justifyContent='center'>
				<Text>no properties uploaded</Text>
			</View>
		);
	};

	return (
		<FlatList
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
			refreshing={refreshing}
			onRefresh={handleRefresh}
			ListFooterComponent={renderFooter}
		/>
	);
};
